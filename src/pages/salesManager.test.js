import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SalesManager from './SalesManager';

jest.mock('axios');

describe('SalesManager Dashboard Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders SalesManager Dashboard', async () => {
        // Mock API response for orders
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    products: [
                        { id: 101, name: 'Product A' },
                        { id: 102, name: 'Product B' },
                    ],
                },
            ],
        });

        render(<SalesManager />);

        // Wait for orders to load
        await waitFor(() => {
            expect(screen.getByText('Sales Manager Dashboard')).toBeInTheDocument();
        });

        // Check if orders are displayed
        expect(screen.getByText('Order #1')).toBeInTheDocument();
        expect(screen.getByText('Product A')).toBeInTheDocument();
        expect(screen.getByText('Product B')).toBeInTheDocument();
    });

    test('applies discount successfully', async () => {
        axios.put.mockResolvedValueOnce({ data: { message: 'Discount applied successfully!' } });

        render(<SalesManager />);

        // Simulate user input
        const productInput = screen.getByPlaceholderText('Product IDs (comma-separated)');
        const discountInput = screen.getByPlaceholderText('Discount Rate (%)');
        const applyDiscountButton = screen.getByText('Apply Discount');

        fireEvent.change(productInput, { target: { value: '101,102' } });
        fireEvent.change(discountInput, { target: { value: '10' } });
        fireEvent.click(applyDiscountButton);

        // Wait for the alert to show
        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/api/salesmanager/applyDiscount', {
                productIds: ['101', '102'],
                discountRate: 10,
            });
            expect(screen.getByText('Discount applied successfully!')).toBeTruthy();
        });
    });

    test('generates sales report', async () => {
        axios.post.mockResolvedValueOnce({
            data: { totalRevenue: 5000, totalProfit: 1500 },
        });

        render(<SalesManager />);

        // Simulate click on the "Generate Sales Report" button
        const reportButton = screen.getByText('Download Report');
        fireEvent.click(reportButton);

        // Wait for the report to load
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/salesmanager/salesreport', {
                startDate: '2023-01-01',
                endDate: '2023-12-31',
            });
        });
    });

    test('processes refund successfully', async () => {
        axios.put.mockResolvedValueOnce({ data: { message: 'Refund processed successfully!' } });

        render(<SalesManager />);

        // Wait for the mock orders to load
        await waitFor(() => {
            expect(screen.getByText('Order #1')).toBeInTheDocument();
        });

        const refundButton = screen.getByText('Refund');
        fireEvent.click(refundButton);

        // Verify refund API call
        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/api/salesmanager/refund/1', { productId: 101 });
            expect(screen.getByText('Refund processed successfully!')).toBeTruthy();
        });
    });
});
