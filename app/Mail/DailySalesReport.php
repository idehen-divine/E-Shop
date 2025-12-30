<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DailySalesReport extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public array $reportData
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Daily Sales Report - '.$this->reportData['date'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.daily-sales-report',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
