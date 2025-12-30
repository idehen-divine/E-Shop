<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Sales Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .container {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
        }

        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background-color: #f9fafb;
        }

        .summary-card {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .summary-card h3 {
            margin: 0 0 5px 0;
            font-size: 14px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 600;
        }

        .summary-card p {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #111827;
        }

        .content {
            padding: 30px;
        }

        .content h2 {
            margin-top: 0;
            color: #111827;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        thead {
            background-color: #f9fafb;
        }

        th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }

        tr:hover {
            background-color: #f9fafb;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .product-name {
            font-weight: 600;
            color: #111827;
        }

        .sku {
            color: #6b7280;
            font-size: 0.875rem;
        }

        .price {
            font-weight: 600;
            color: #059669;
        }

        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
            padding: 20px 30px;
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
        }

        .no-sales {
            text-align: center;
            padding: 40px;
            color: #6b7280;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>📊 Daily Sales Report</h1>
            <p>{{ $reportData['date'] }}</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>Total Revenue</h3>
                <p>Rp {{ number_format($reportData['totalRevenue'], 0, ',', '.') }}</p>
            </div>
            <div class="summary-card">
                <h3>Items Sold</h3>
                <p>{{ $reportData['totalItems'] }}</p>
            </div>
            <div class="summary-card">
                <h3>Unique Products</h3>
                <p>{{ $reportData['uniqueProducts'] }}</p>
            </div>
        </div>

        <div class="content">
            <h2>Sales Details</h2>

            @if ($reportData['sales']->count() > 0)
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th class="text-center">Quantity</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Subtotal</th>
                            <th>Customer</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($reportData['sales'] as $sale)
                            <tr>
                                <td>
                                    <div class="product-name">{{ $sale->product->name }}</div>
                                    <div class="sku">SKU: {{ $sale->product->sku }}</div>
                                </td>
                                <td class="text-center">{{ $sale->quantity }}</td>
                                <td class="text-right">Rp {{ number_format($sale->price, 0, ',', '.') }}</td>
                                <td class="text-right price">Rp
                                    {{ number_format($sale->quantity * $sale->price, 0, ',', '.') }}</td>
                                <td>{{ $sale->cart->user->name ?? 'Guest' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <div class="no-sales">
                    <p>No sales recorded for this period.</p>
                </div>
            @endif
        </div>

        <div class="footer">
            <p>This is an automated daily sales report from {{ config('app.name') }}</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
