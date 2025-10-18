import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import EquipmentMediaManager from '../../components/media/EquipmentMediaManager';
import schoolsService from '../../services/schools';

const ViewEquipmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { equipmentId } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const response = await schoolsService.getEquipmentById(equipmentId);
      setEquipment(response);
    } catch (error) {
      console.error('Failed to load equipment details:', error);
      toast.error(t('equipment.view.loadFailed'));
      navigate('/admin/school-management/equipment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (equipmentId) {
      loadEquipment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentId]);

  const infoRows = useMemo(() => {
    if (!equipment) return [];
    return [
      {
        label: t('equipment.form.name'),
        value: equipment.name
      },
      {
        label: t('equipment.form.room'),
        value: equipment.room_name
      },
      {
        label: t('equipment.form.quantity'),
        value: equipment.quantity
      },
      {
        label: t('equipment.view.status'),
        value: equipment.is_active ? t('common.active') : t('common.inactive'),
        type: 'badge',
        badgeVariant: equipment.is_active ? 'default' : 'secondary'
      },
      {
        label: t('equipment.form.description'),
        value: equipment.description || t('common.notProvided')
      },
      {
        label: t('equipment.view.createdAt'),
        value: equipment.created_at ? new Date(equipment.created_at).toLocaleString() : '—'
      },
      {
        label: t('equipment.view.updatedAt'),
        value: equipment.updated_at ? new Date(equipment.updated_at).toLocaleString() : '—'
      }
    ];
  }, [equipment, t]);

  const actions = [
    <Button key="back" variant="outline" onClick={() => navigate('/admin/school-management/equipment')}>
      {t('common.backToList')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('equipment.view.title')}
        subtitle={t('equipment.view.subtitle')}
        actions={actions}
        loading
      />
    );
  }

  if (!equipment) {
    return null;
  }

  return (
    <AdminPageLayout
      title={equipment.name}
      subtitle={t('equipment.view.subtitle')}
      actions={actions}
    >
      <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>{t('equipment.view.details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {infoRows.map((row) => (
              <div key={row.label} className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {row.label}
                </span>
                {row.type === 'badge' ? (
                  <Badge variant={row.badgeVariant}>{row.value}</Badge>
                ) : (
                  <span className="text-sm text-foreground">{row.value}</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <EquipmentMediaManager
          equipmentId={equipment.id}
          equipmentName={equipment.name}
          contentTypeId={equipment.content_type}
        />
      </div>
    </AdminPageLayout>
  );
};

export default ViewEquipmentPage;
