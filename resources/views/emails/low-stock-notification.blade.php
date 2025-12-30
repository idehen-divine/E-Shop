<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Low Stock Alert</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #dc2626;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }

        .content {
            background-color: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
        }

        .alert-box {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
        }

        .product-details {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        .product-details h3 {
            margin-top: 0;
            color: #111827;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            font-weight: 600;
            color: #6b7280;
        }

        .detail-value {
            color: #111827;
        }

        .stock-warning {
            color: #dc2626;
            font-weight: 700;
            font-size: 1.2em;
        }

        .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
        }

        .button:hover {
            background-color: #1d4ed8;
        }

        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1 style="margin: 0;">⚠️ Low Stock Alert</h1>
    </div>

    <div class="content">
        <div class="alert-box">
            <strong>Attention Required:</strong> A product in your inventory is running low on stock and needs immediate
            attention.
        </div>

        <div class="product-details">
            <h3>Product Information</h3>

            <div class="detail-row">
                <span class="detail-label">Product Name:</span>
                <span class="detail-value">{{ $product->name }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">SKU:</span>
                <span class="detail-value">{{ $product->sku }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Current Stock:</span>
                <span class="stock-warning">{{ $product->stock }} units</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Low Stock Threshold:</span>
                <span class="detail-value">{{ $lowStockThreshold }} units</span>
            </div>

            @if ($product->price)
                <div class="detail-row">
                    <span class="detail-label">Price:</span>
                    <span class="detail-value">Rp {{ number_format($product->price, 0, ',', '.') }}</span>
                </div>
            @endif
        </div>

        <p style="margin: 20px 0;">
            <strong>Action Required:</strong> Please restock this product as soon as possible to avoid running out of
            inventory.
        </p>

        <div style="text-align: center;">
            <a href="{{ config('app.url') }}/admin/products" class="button">
                View Product in Admin Panel
            </a>
        </div>

        <div class="footer">
            <p>This is an automated notification from your inventory management system.</p>
            <p>{{ config('app.name') }} &copy; {{ date('Y') }}</p>
        </div>
    </div>
</body>

</html>
