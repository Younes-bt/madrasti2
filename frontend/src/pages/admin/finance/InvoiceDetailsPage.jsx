import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Printer,
    Download,
    ArrowLeft,
    User,
    FileText,
    School
} from 'lucide-react';
import financeService from '@/services/finance';
import api from '@/services/api';
import { toast } from 'sonner';
import AdminPageLayout from '../../../components/admin/layout/AdminPageLayout';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const InvoiceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [invoice, setInvoice] = useState(null);
    const [schoolConfig, setSchoolConfig] = useState(null);
    const invoiceRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchSchoolConfig = async () => {
        try {
            let configResponse = await api.get('/schools/config/');
            const data = configResponse.data;

            let schoolData;
            if (data.results && Array.isArray(data.results)) {
                schoolData = data.results[0];
            } else if (Array.isArray(data)) {
                schoolData = data[0];
            } else {
                schoolData = data;
            }

            return schoolData;
        } catch (listError) {
            try {
                const detailResponse = await api.get('/schools/config/1/');
                return detailResponse.data;
            } catch (detailError) {
                console.error('Both config endpoints failed:', { listError, detailError });
                return null;
            }
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invoiceData, schoolData] = await Promise.all([
                financeService.getInvoice(id),
                fetchSchoolConfig()
            ]);
            setInvoice(invoiceData);
            setSchoolConfig(schoolData);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(t('Failed to load invoice details'));
            navigate('/admin/finance/invoices');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;

        try {
            toast.info(t('Generating PDF...'));

            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`Invoice-INV-${invoice.id}.pdf`);

            toast.success(t('PDF downloaded successfully'));
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error(t('Failed to generate PDF'));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PAID': return <Badge className="bg-green-500">{t('Paid')}</Badge>;
            case 'PARTIALLY_PAID': return <Badge className="bg-yellow-500">{t('Partial')}</Badge>;
            case 'OVERDUE': return <Badge className="bg-red-500">{t('Overdue')}</Badge>;
            case 'ISSUED': return <Badge className="bg-blue-500">{t('Issued')}</Badge>;
            default: return <Badge variant="outline">{t('Draft')}</Badge>;
        }
    };

    if (loading) {
        return (
            <AdminPageLayout title={t('Invoice Details')} loading={true}>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AdminPageLayout>
        );
    }

    if (!invoice) return null;

    const schoolName = schoolConfig?.name || 'School Name';
    const schoolNameAr = schoolConfig?.name_ar || '';
    const schoolAddress = schoolConfig?.address || '';
    const schoolPhone = schoolConfig?.phone_number || '';
    const schoolEmail = schoolConfig?.email_address || '';

    return (
        <>
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #invoice-content, #invoice-content * {
                            visibility: visible;
                        }
                        #invoice-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}
            </style>
            <AdminPageLayout
                title={t('Invoice Details')}
                subtitle={`INV-${invoice.id}`}
                actions={[
                    <Button key="back" variant="outline" onClick={() => navigate('/admin/finance/invoices')} className="no-print">
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t('Back to List')}
                    </Button>,
                    <Button key="print" variant="outline" onClick={handlePrint} className="no-print">
                        <Printer className="mr-2 h-4 w-4" /> {t('Print')}
                    </Button>,
                    <Button key="download" onClick={handleDownloadPDF} className="no-print">
                        <Download className="mr-2 h-4 w-4" /> {t('Download PDF')}
                    </Button>
                ]}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 max-w-4xl mx-auto"
                >
                    <div id="invoice-content" ref={invoiceRef}>
                        <Card className="overflow-hidden border-t-4 border-t-primary">
                            <CardHeader className="bg-muted/30 pb-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        {schoolConfig?.logo_url ? (
                                            <img
                                                src={schoolConfig.logo_url}
                                                alt={schoolName}
                                                className="h-16 w-16 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <School className="h-8 w-8 text-primary" />
                                            </div>
                                        )}
                                        <div>
                                            <CardTitle className="text-2xl font-bold">{schoolName}</CardTitle>
                                            {schoolNameAr && (
                                                <CardDescription className="text-lg">{schoolNameAr}</CardDescription>
                                            )}
                                            {schoolAddress && (
                                                <CardDescription>{schoolAddress}</CardDescription>
                                            )}
                                            <CardDescription>
                                                {schoolEmail && <span>{schoolEmail}</span>}
                                                {schoolEmail && schoolPhone && <span> | </span>}
                                                {schoolPhone && <span>{schoolPhone}</span>}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-3xl font-bold text-primary">INVOICE</h2>
                                        <p className="text-muted-foreground font-mono mt-1">#INV-{invoice.id}</p>
                                        <div className="mt-2">
                                            {getStatusBadge(invoice.status)}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('Bill To')}</h3>
                                        <div className="flex items-start gap-3">
                                            <User className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-bold text-lg">{invoice.student_name}</p>
                                                <p className="text-muted-foreground">Student ID: {invoice.student}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:text-right">
                                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('Invoice Details')}</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between md:justify-end gap-4">
                                                <span className="text-muted-foreground">{t('Issue Date')}:</span>
                                                <span className="font-medium">{invoice.issue_date}</span>
                                            </div>
                                            <div className="flex justify-between md:justify-end gap-4">
                                                <span className="text-muted-foreground">{t('Due Date')}:</span>
                                                <span className="font-medium">{invoice.due_date}</span>
                                            </div>
                                            <div className="flex justify-between md:justify-end gap-4">
                                                <span className="text-muted-foreground">{t('Billing Month')}:</span>
                                                <span className="font-medium">{invoice.month}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="text-lg font-semibold mb-4">{t('Invoice Items')}</h3>
                                    <div className="rounded-md border">
                                        <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium text-muted-foreground">
                                            <div className="col-span-8">{t('Description')}</div>
                                            <div className="col-span-4 text-right">{t('Amount')}</div>
                                        </div>
                                        <div className="divide-y">
                                            {invoice.items && invoice.items.length > 0 ? (
                                                invoice.items.map((item, index) => (
                                                    <div key={index} className="grid grid-cols-12 p-3 text-sm">
                                                        <div className="col-span-8 font-medium">{item.description}</div>
                                                        <div className="col-span-4 text-right">{item.amount} DH</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-muted-foreground">{t('No items found')}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end space-y-3">
                                    <div className="w-full md:w-1/3 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{t('Subtotal')}</span>
                                            <span>{invoice.total_amount} DH</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{t('Tax (0%)')}</span>
                                            <span>0.00 DH</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>{t('Total')}</span>
                                            <span>{invoice.total_amount} DH</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-green-600 font-medium">
                                            <span>{t('Amount Paid')}</span>
                                            <span>- {invoice.paid_amount} DH</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between text-lg font-bold text-primary">
                                            <span>{t('Balance Due')}</span>
                                            <span>{(parseFloat(invoice.total_amount) - parseFloat(invoice.paid_amount)).toFixed(2)} DH</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 p-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    <p>{t('Thank you for your business. Please ensure payment is made by the due date.')}</p>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </motion.div>
            </AdminPageLayout>
        </>
    );
};

export default InvoiceDetailsPage;
