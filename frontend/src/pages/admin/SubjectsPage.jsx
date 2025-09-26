import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const SubjectsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Function to get localized subject name based on current language
  const getLocalizedSubjectName = (subject) => {
    const currentLanguage = i18n.language;
    
    switch (currentLanguage) {
      case 'ar':
        return subject.name_arabic || subject.name;
      case 'fr':
        return subject.name_french || subject.name;
      default:
        return subject.name;
    }
  };
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get('schools/subjects/');
      let subjectsData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);
      setSubjects(subjectsData);
      setFilteredSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [t]);

  // Re-filter subjects when language changes
  useEffect(() => {
    if (subjects.length > 0) {
      // Directly apply the current search filter with the new language
      let filtered = subjects;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(subject => {
          const localizedName = getLocalizedSubjectName(subject).toLowerCase();
          return localizedName.includes(query) ||
                 subject.name.toLowerCase().includes(query) ||
                 (subject.name_arabic && subject.name_arabic.includes(query)) ||
                 (subject.name_french && subject.name_french.toLowerCase().includes(query)) ||
                 subject.code.toLowerCase().includes(query);
        });
      }
      setFilteredSubjects(filtered);
    }
  }, [i18n.language, subjects]);

  useEffect(() => {
    let filtered = subjects;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(subject => {
        const localizedName = getLocalizedSubjectName(subject).toLowerCase();
        return localizedName.includes(query) ||
               subject.name.toLowerCase().includes(query) ||
               (subject.name_arabic && subject.name_arabic.includes(query)) ||
               (subject.name_french && subject.name_french.toLowerCase().includes(query)) ||
               subject.code.toLowerCase().includes(query);
      });
    }
    setFilteredSubjects(filtered);
  }, [searchQuery, subjects, i18n.language]);

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm(t('subjects.confirmDelete'))) {
      try {
        await apiMethods.delete(`schools/subjects/${subjectId}/`);
        toast.success(t('subjects.deleteSuccess'));
        fetchSubjects();
      } catch (error) {
        console.error('Failed to delete subject:', error);
        toast.error(t('subjects.deleteError'));
      }
    }
  };

  const actions = [
    <Button
      key="add-subject"
      onClick={() => navigate('/admin/academic-management/subjects/add')}
      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
    >
      <Plus className="h-4 w-4 mr-2" />
      {t('subjects.addSubject')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('subjects.title')}
      subtitle={t('subjects.subtitle')}
      actions={actions}
    >
      <div className="space-y-6">
        <motion.div
          className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('subjects.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card rounded-lg p-6 space-y-3 border shadow-sm">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))
          ) : filteredSubjects.length === 0 ? (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {searchQuery ? t('subjects.noSubjectsFound') : t('subjects.noSubjectsYet')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('subjects.addFirstSubject')}
              </p>
            </motion.div>
          ) : (
            filteredSubjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {getLocalizedSubjectName(subject)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{subject.code}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/academic-management/subjects/${subject.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/academic-management/subjects/${subject.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteSubject(subject.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Additional subject details can be added here */}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default SubjectsPage;
