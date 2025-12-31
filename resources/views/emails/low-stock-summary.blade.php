<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
        }

        .summary {
            background: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 4px;
        }

        .summary p {
            margin: 5px 0;
            color: #991b1b;
            font-weight: 500;
        }

        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .products-table th {
            background: #f9fafb;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
        }

        .products-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }

        .products-table tr:hover {
            background: #f9fafb;
        }

        .stock-critical {
            color: #dc2626;
            font-weight: 600;
        }

        .stock-low {
            color: #f59e0b;
            font-weight: 600;
        }

        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }

        .badge-critical {
            background: #fef2f2;
            color: #dc2626;
        }

        .badge-low {
            background: #fef3c7;
            color: #f59e0b;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>⚠️ Low Stock Summary Report</h1>
    </div>

    <div class="content">
        <div class="summary">
            <p>📊 Total Products Below Threshold: {{ count($products) }}</p>
            <p>📉 Stock Threshold: {{ $threshold }} units</p>
            <p>📅 Report Date: {{ now()->format('F j, Y g:i A') }}</p>
        </div>

        <h2 style="color: #111827; margin-bottom: 15px;">Products Requiring Attention</h2>

        <table class="products-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($products as $product)
                    <tr>
                        <td>
                            <strong>{{ $product->name }}</strong>
                            @if ($product->categories->isNotEmpty())
                                <br>
                                <small
                                    style="color: #6b7280;">{{ $product->categories->pluck('name')->join(', ') }}</small>
                            @endif
                        </td>
                        <td>{{ $product->sku }}</td>
                        <td>
                            @if ($product->stock <= 3)
                                <span class="stock-critical">{{ $product->stock }}</span>
                            @else
                                <span class="stock-low">{{ $product->stock }}</span>
                            @endif
                        </td>
                        <td>${{ number_format($product->price / 100, 2) }}</td>
                        <td>
                            @if ($product->stock <= 3)
                                <span class="badge badge-critical">CRITICAL</span>
                            @else
                                <span class="badge badge-low">LOW</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <p
            style="margin-top: 25px; padding: 15px; background: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
            <strong>💡 Recommendation:</strong> Please review and restock these items to maintain inventory levels and
            prevent stockouts.
        </p>
    </div>

    <div class="footer">
        <p>This is an automated report from your inventory management system.</p>
        <p>Generated on {{ now()->format('F j, Y \a\t g:i A') }}</p>
    </div>
</body>

</html>
