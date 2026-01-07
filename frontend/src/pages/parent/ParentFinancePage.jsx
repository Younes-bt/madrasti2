import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';

const ParentFinancePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    return (
        <DashboardLayout user={user}>
            <div className="mx-auto max-w-7xl p-6 md:p-8 space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        {t('parentHome.finance', 'Finance')}
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">
                        {t('common.underConstruction', 'This page is under construction.')}
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ParentFinancePage;
