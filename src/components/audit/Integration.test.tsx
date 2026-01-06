import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { UploadSection } from './UploadSection';
import { AuditTable } from './AuditTable';
import { useAuditStore } from '@/hooks/useAuditStore';
import { apiService } from '@/services/api.service';

// Mock apiService
vi.mock('@/services/api.service', () => ({
  apiService: {
    runValidationTask: vi.fn(),
    generateReport: vi.fn(),
  }
}));

// Mock UploadSection for simplicity in integration if needed, but we want to test interaction
// So we will use the real one, but we might need to mock DragEvents if we rely on dnd heavily.
// Instead, we can simulate `setFile` directly via store or trigger the input change.

describe('Audit Flow Integration', () => {
    beforeEach(() => {
        // Reset store
        useAuditStore.setState({
            files: { ce1: null, ce2: null, ce3: null, rw: null },
            results: {},
            isLoading: false,
            error: null
        });
        vi.clearAllMocks();
    });

    it('updates file state when file is selected', async () => {
        render(<UploadSection />);
        const fileInput = screen.getByLabelText("", { selector: 'input[type="file"][id="ce1File"]' });
        
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        const storeState = useAuditStore.getState();
        expect(storeState.files.ce1).toBeDefined();
        expect(storeState.files.ce1?.name).toBe('test.pdf');
        
        expect(screen.getByText('test.pdf')).toBeDefined();
    });

    it('runs validation task and updates results', async () => {
        // Setup scenarios
        useAuditStore.setState({
            files: {
                ce1: { name: 'ce1.pdf', size: 100, type: 'pdf', file: new File([], 'ce1.pdf') } as any,
                rw: null
            }
        });

        // Mock API response
        (apiService.runValidationTask as any).mockResolvedValue({ status: 'pass' });

        render(<AuditTable />);
        
        // Use regex for flexible matching if needed, or specific test id
        const runBtns = screen.getAllByText('Run');
        const grammarBtn = runBtns[0]; // First one is likely grammar check
        
        fireEvent.click(grammarBtn);

        // Check loading state
        // Initial click calls runTask which sets loading true globally? yes
        // But also sets cell loading.
        // We can check store state or UI.
        
        await waitFor(() => {
            expect(apiService.runValidationTask).toHaveBeenCalled();
        });

        await waitFor(() => {
            // Check for Q (Qualified) or pass class
            const passBadges = screen.getAllByText('Q');
            expect(passBadges.length).toBeGreaterThan(0);
        });
    });
});
