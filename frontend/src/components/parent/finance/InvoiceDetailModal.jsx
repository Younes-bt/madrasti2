import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { FileText, Printer, Download, Loader2 } from 'lucide-react';

const InvoiceDetailModal = ({ invoice, isOpen, onClose }) => {
    const { t } = useTranslation();
    const invoiceRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    if (!invoice) return null;

    const handleDownload = async () => {
        if (!invoiceRef.current) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice_${invoice.id}.pdf`);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handlePrint = async () => {
        if (!invoiceRef.current) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Print Invoice #${invoice.id}</title>
                            <style>
                                body { margin: 0; display: flex; justify-content: center; align-items: flex-start; padding-top: 20px; font-family: sans-serif; }
                                img { max-width: 100%; height: auto; }
                                @page { size: auto; margin: 10mm; }
                            </style>
                        </head>
                        <body>
                            <img src="${imgData}" />
                            <script>
                                window.onload = () => {
                                    window.print();
                                    window.close();
                                };
                            </script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            }
        } catch (error) {
            console.error('Failed to print:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl sm:rounded-2xl">
                <div ref={invoiceRef} className="bg-white p-2">
                    <DialogHeader className="flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                                <FileText className="h-5 w-5" />
                            </div>
                            <DialogTitle className="text-xl">
                                {t('finance.invoiceDetails', 'Invoice Details')} #{invoice.id}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="mt-4 space-y-6">
                        {/* Header Info */}
                        <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {t('finance.student', 'Student')}
                                </p>
                                <p className="mt-1 font-bold text-slate-900">{invoice.student_name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {t('finance.month', 'Billing Month')}
                                </p>
                                <p className="mt-1 font-bold text-slate-900">{invoice.month}</p>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900">{t('finance.items', 'Invoice Items')}</h3>
                            <div className="space-y-3">
                                {invoice.items?.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-1">
                                        <span className="text-sm font-medium text-slate-600">{item.description}</span>
                                        <span className="text-sm font-bold text-slate-900">{parseFloat(item.amount).toFixed(2)} MAD</span>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">{t('finance.totalAmount', 'Total Amount')}</span>
                                    <span className="text-lg font-bold text-slate-900">{parseFloat(invoice.total_amount).toFixed(2)} MAD</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-500">{t('finance.paidAmount', 'Paid Amount')}</span>
                                    <span className="text-sm font-bold text-emerald-600">-{parseFloat(invoice.paid_amount).toFixed(2)} MAD</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-indigo-50/50 p-3">
                                    <span className="text-base font-bold text-slate-900">{t('finance.remainingBalance', 'Remaining Balance')}</span>
                                    <span className="text-xl font-black text-indigo-600">{parseFloat(invoice.remaining_amount).toFixed(2)} MAD</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {invoice.notes && (
                            <div className="rounded-lg border border-slate-100 p-3">
                                <p className="text-xs font-semibold text-slate-400">{t('finance.notes', 'Notes')}</p>
                                <p className="mt-1 text-sm text-slate-600 italic">{invoice.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-6 flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 gap-2 rounded-xl"
                        onClick={handlePrint}
                        disabled={isExporting}
                    >
                        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
                        {t('common.print', 'Print')}
                    </Button>
                    <Button
                        className="flex-1 gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                        onClick={handleDownload}
                        disabled={isExporting}
                    >
                        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        {t('common.download', 'Download')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceDetailModal;
