<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LowStockSummary extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Collection $products,
        public int $threshold
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Low Stock Summary - '.count($this->products).' Products',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.low-stock-summary',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
