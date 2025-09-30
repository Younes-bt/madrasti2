import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Eye,
  Save,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { apiMethods } from '../../services/api';
import { authStorage } from '../../utils/storage';
import { toast } from 'sonner';

const BulkImportStudentsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [currentStep, setCurrentStep] = useState('structure'); // 'structure', 'template', 'upload', 'results'
  
  // Progress tracking states
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importJobId, setImportJobId] = useState(null);
  const [pollInterval, setPollInterval] = useState(null);
  const [educationalStructure, setEducationalStructure] = useState({
    levelId: '',
    gradeId: '',
    classId: '',
    academicYearId: ''
  });
  const [availableData, setAvailableData] = useState({
    levels: [],
    grades: [],
    classes: [],
    academicYears: []
  });

  // Fetch available educational structure data
  useEffect(() => {
    const fetchAvailableData = async () => {
      try {
        const response = await apiMethods.get('users/bulk-import/status/');
        setAvailableData({
          levels: response.educational_levels || [],
          grades: [],
          classes: [],
          academicYears: response.academic_years || []
        });
      } catch (error) {
        console.error('Failed to fetch educational structure data:', error);
        toast.error('Failed to load educational structure data');
      }
    };

    fetchAvailableData();
  }, []);

  // Cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  // Update grades when level changes
  useEffect(() => {
    if (educationalStructure.levelId) {
      const selectedLevel = availableData.levels.find(l => l.id === parseInt(educationalStructure.levelId));
      if (selectedLevel) {
        setAvailableData(prev => ({
          ...prev,
          grades: selectedLevel.grades || []
        }));
      }
    } else {
      setAvailableData(prev => ({
        ...prev,
        grades: [],
        classes: []
      }));
    }
  }, [educationalStructure.levelId, availableData.levels]);

  // Download Excel template
  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    try {
      // Build URL with educational structure parameters
      const params = new URLSearchParams({
        level_id: educationalStructure.levelId,
        grade_id: educationalStructure.gradeId,
        class_id: educationalStructure.classId,
        academic_year_id: educationalStructure.academicYearId
      });
      
      const response = await fetch(`/api/users/bulk-import/students/?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authStorage.get('token')}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download template: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Extract filename from response header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') 
        : `student_import_template_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(t('bulkImport.templateDownloaded'));
    } catch (error) {
      console.error('Template download failed:', error);
      toast.error(t('bulkImport.templateDownloadFailed') + ': ' + error.message);
    } finally {
      setDownloadingTemplate(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setPreviewData(null);
      setImportResults(null);
      setCurrentStep('upload');
    }
  };

  // Upload file for preview
  const handlePreviewUpload = async () => {
    if (!uploadedFile) {
      toast.error(t('bulkImport.pleaseSelectFile'));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('preview', 'true');
      formData.append('level_id', educationalStructure.levelId);
      formData.append('grade_id', educationalStructure.gradeId);
      formData.append('class_id', educationalStructure.classId);
      formData.append('academic_year_id', educationalStructure.academicYearId);

      const response = await apiMethods.postFormData('users/bulk-import/students/', formData);
      
      setPreviewData(response);
      setCurrentStep('upload'); // Stay on upload step to show preview
      
      if (response.errors && response.errors.length > 0) {
        toast.warning(t('bulkImport.previewWithErrors', { count: response.errors.length }));
      } else {
        toast.success(t('bulkImport.previewGenerated', { count: response.processed_rows }));
      }
      
    } catch (error) {
      console.error('Preview failed:', error);
      toast.error(error.response?.data?.error || t('bulkImport.previewFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Poll for import progress updates
  const pollImportProgress = (jobId) => {
    const interval = setInterval(async () => {
      try {
        const response = await apiMethods.get(`users/bulk-import/progress/${jobId}/`);
        const { progress, current_status, completed, error, results } = response;
        
        setImportProgress(progress || 0);
        setImportStatus(current_status || t('bulkImport.processing'));
        
        if (completed || error) {
          clearInterval(interval);
          setPollInterval(null);
          
          if (error) {
            setIsImporting(false);
            setImportProgress(0);
            setImportStatus('');
            setImportJobId(null);
            toast.error(error);
          } else if (results) {
            // Import completed successfully
            setImportProgress(100);
            setImportStatus(t('bulkImport.importComplete'));
            setImportResults(results);
            setCurrentStep('results');
            
            // Show success message
            if (results.successful_imports > 0) {
              toast.success(t('bulkImport.importCompleted', { 
                successful: results.successful_imports,
                total: results.processed_rows || results.total_rows
              }));
            } else if (results.successful_imports === 0) {
              toast.warning(t('bulkImport.noStudentsImported'));
            }
            
            // Clean up importing state after a delay to show completion
            setTimeout(() => {
              setIsImporting(false);
              setImportJobId(null);
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error polling progress:', error);
        // Don't clear interval on temporary errors, keep polling
      }
    }, 1000); // Poll every 1 second
    
    setPollInterval(interval);
    return interval;
  };

  // Simulate progress updates during import (fallback for older backend)
  const simulateProgress = (totalRows) => {
    setImportProgress(0);
    setImportStatus(t('bulkImport.preparingImport'));
    
    let progress = 0;
    const steps = [
      { progress: 10, status: t('bulkImport.validatingData') },
      { progress: 25, status: t('bulkImport.creatingStudentAccounts') },
      { progress: 50, status: t('bulkImport.creatingParentAccounts') },
      { progress: 75, status: t('bulkImport.settingUpEnrollments') },
      { progress: 90, status: t('bulkImport.finalizingImport') },
      { progress: 100, status: t('bulkImport.importComplete') }
    ];
    
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setImportProgress(step.progress);
        setImportStatus(step.status);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800); // Update every 800ms
    
    return interval;
  };

  // Execute actual import
  const handleFinalImport = async () => {
    if (!uploadedFile) {
      toast.error(t('bulkImport.pleaseSelectFile'));
      return;
    }

    setLoading(true);
    setIsImporting(true);
    let progressInterval = null;
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('preview', 'false');
      formData.append('level_id', educationalStructure.levelId);
      formData.append('grade_id', educationalStructure.gradeId);
      formData.append('class_id', educationalStructure.classId);
      formData.append('academic_year_id', educationalStructure.academicYearId);

      const response = await apiMethods.postFormData('users/bulk-import/students/', formData);
      
      // Check if backend supports real-time progress tracking
      if (response.job_id) {
        // Use real progress tracking
        setImportJobId(response.job_id);
        setImportProgress(0);
        setImportStatus(t('bulkImport.preparingImport'));
        
        pollImportProgress(response.job_id);
        
        // The polling will handle completion automatically
      } else {
        // Fallback to simulation if backend doesn't support progress tracking
        const totalRows = previewData?.processed_rows || 0;
        progressInterval = simulateProgress(totalRows);
        
        // Wait for simulation to complete (about 5 seconds)
        await new Promise(resolve => setTimeout(resolve, 5500));
        
        // Set final results
        setImportProgress(100);
        setImportStatus(t('bulkImport.importComplete'));
        setImportResults(response);
        setCurrentStep('results');
        
        // Show appropriate success/error messages
        if (response && response.successful_imports > 0) {
          toast.success(t('bulkImport.importCompleted', { 
            successful: response.successful_imports,
            total: response.processed_rows || response.total_rows
          }));
        } else if (response && response.successful_imports === 0) {
          toast.warning(t('bulkImport.noStudentsImported'));
        }
      }
      
    } catch (error) {
      console.error('Import failed:', error);
      
      // Clean up progress interval
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
      
      // Reset progress states
      setImportProgress(0);
      setImportStatus('');
      setImportJobId(null);
      setIsImporting(false);
      
      // Show error message
      const errorMessage = error.response?.data?.error || error.message || t('bulkImport.importFailed');
      toast.error(errorMessage);
      
    } finally {
      // Clean up progress interval only if not using real progress tracking
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      // Only clean up loading state, keep importing state for real progress tracking
      setLoading(false);
    }
  };

  // Reset to start
  const handleReset = () => {
    setUploadedFile(null);
    setPreviewData(null);
    setImportResults(null);
    setCurrentStep('structure');
    setEducationalStructure({
      levelId: '',
      gradeId: '',
      classId: '',
      academicYearId: ''
    });
    
    // Reset progress states
    setImportProgress(0);
    setImportStatus('');
    setIsImporting(false);
    setImportJobId(null);
    setLoading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle structure selection completion
  const handleStructureComplete = () => {
    if (!educationalStructure.levelId || !educationalStructure.gradeId || 
        !educationalStructure.classId || !educationalStructure.academicYearId) {
      toast.error('Please select all educational structure fields');
      return;
    }
    setCurrentStep('template');
  };

  // Fetch classes when grade changes
  const handleGradeChange = async (gradeId) => {
    setEducationalStructure(prev => ({
      ...prev,
      gradeId,
      classId: '' // Reset class selection
    }));

    if (gradeId) {
      try {
        // Fetch ALL classes for the selected grade from the proper endpoint
        const response = await apiMethods.get(`schools/classes/?grade=${gradeId}`);

        // Handle both paginated and non-paginated responses
        const classes = Array.isArray(response) ? response : (response.results || response.data || []);

        setAvailableData(prev => ({
          ...prev,
          classes: classes
        }));
      } catch (error) {
        console.error('Failed to fetch classes:', error);
        toast.error('Failed to load classes');
        setAvailableData(prev => ({
          ...prev,
          classes: []
        }));
      }
    } else {
      setAvailableData(prev => ({
        ...prev,
        classes: []
      }));
    }
  };

  const renderStructureStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('bulkImport.selectEducationalStructure')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {t('bulkImport.structureDescription')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Educational Level */}
              <div className="space-y-2">
                <Label htmlFor="level">{t('student.educationalLevel')}</Label>
                <Select
                  value={educationalStructure.levelId}
                  onValueChange={(value) => {
                    setEducationalStructure(prev => ({
                      ...prev,
                      levelId: value,
                      gradeId: '', // Reset grade and class when level changes
                      classId: ''
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('student.placeholders.educationalLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableData.levels.map(level => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grade */}
              <div className="space-y-2">
                <Label htmlFor="grade">{t('student.grade')}</Label>
                <Select
                  value={educationalStructure.gradeId}
                  onValueChange={handleGradeChange}
                  disabled={!educationalStructure.levelId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('student.placeholders.grade')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableData.grades.map(grade => (
                      <SelectItem key={grade.id} value={grade.id.toString()}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Class */}
              <div className="space-y-2">
                <Label htmlFor="class">{t('student.schoolClass')}</Label>
                <Select
                  value={educationalStructure.classId}
                  onValueChange={(value) => {
                    setEducationalStructure(prev => ({
                      ...prev,
                      classId: value
                    }));
                  }}
                  disabled={!educationalStructure.gradeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('student.placeholders.schoolClass')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableData.classes.map(schoolClass => (
                      <SelectItem key={schoolClass.id} value={schoolClass.id.toString()}>
                        {schoolClass.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Academic Year */}
              <div className="space-y-2">
                <Label htmlFor="academicYear">{t('student.academicYear')}</Label>
                <Select
                  value={educationalStructure.academicYearId}
                  onValueChange={(value) => {
                    setEducationalStructure(prev => ({
                      ...prev,
                      academicYearId: value
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('student.placeholders.academicYear')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableData.academicYears.map(year => (
                      <SelectItem key={year.id} value={year.id.toString()}>
                        {year.year} {year.is_current && `(${t('common.current')})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('bulkImport.allStudentsWillBeEnrolled')}
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button
                onClick={handleStructureComplete}
                disabled={!educationalStructure.levelId || !educationalStructure.gradeId || 
                         !educationalStructure.classId || !educationalStructure.academicYearId}
                className="gap-2"
              >
                {t('common.continue')} 
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTemplateStep = () => (
    <div className="space-y-6">
      {/* Selected Structure Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {t('bulkImport.selectedStructure')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-gray-500">{t('student.educationalLevel')}</Label>
              <p className="font-medium">
                {availableData.levels.find(l => l.id === parseInt(educationalStructure.levelId))?.name}
              </p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">{t('student.grade')}</Label>
              <p className="font-medium">
                {availableData.grades.find(g => g.id === parseInt(educationalStructure.gradeId))?.name}
              </p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">{t('student.schoolClass')}</Label>
              <p className="font-medium">
                {availableData.classes.find(c => c.id === parseInt(educationalStructure.classId))?.name}
              </p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">{t('student.academicYear')}</Label>
              <p className="font-medium">
                {availableData.academicYears.find(y => y.id === parseInt(educationalStructure.academicYearId))?.year}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Template Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t('bulkImport.downloadTemplate')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {t('bulkImport.templateForSelectedStructure')}
            </p>
            <Button 
              onClick={handleDownloadTemplate}
              disabled={downloadingTemplate}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {downloadingTemplate ? t('common.downloading') : t('bulkImport.downloadTemplate')}
            </Button>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('bulkImport.templateNoStructureFields')}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentStep('upload')}
                className="gap-2"
                disabled={!educationalStructure.levelId}
              >
                {t('common.continue')}
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
              
              <Button
                onClick={() => setCurrentStep('structure')}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('common.back')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUploadStep = () => (
    <div className="space-y-6">
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {t('bulkImport.instructions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">{t('bulkImport.step1')}</h4>
                <p className="text-sm text-gray-600 mb-3">{t('bulkImport.step1Description')}</p>
                <Button 
                  onClick={handleDownloadTemplate}
                  disabled={downloadingTemplate}
                  className="gap-2"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  {downloadingTemplate ? t('common.downloading') : t('bulkImport.downloadTemplate')}
                </Button>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">{t('bulkImport.step2')}</h4>
                <p className="text-sm text-gray-600 mb-3">{t('bulkImport.step2Description')}</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• {t('bulkImport.fillRequiredFields')}</li>
                  <li>• {t('bulkImport.deleteSampleRows')}</li>
                  <li>• {t('bulkImport.saveAsXlsx')}</li>
                </ul>
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('bulkImport.templateWarning')}
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('bulkImport.step3')} - {t('bulkImport.uploadFile')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('bulkImport.acceptedFormats')}: .xlsx, .xls
              </p>
            </div>

            {uploadedFile && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {uploadedFile.name}
                </span>
                <span className="text-xs text-green-600">
                  ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handlePreviewUpload}
                disabled={!uploadedFile || loading}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                {loading ? t('common.processing') : t('bulkImport.previewImport')}
              </Button>
              
              {uploadedFile && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('common.reset')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Results - Show after successful preview */}
      {previewData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t('bulkImport.importPreview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{previewData?.total_rows || 0}</div>
                <div className="text-sm text-gray-600">{t('bulkImport.totalRows')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{previewData?.processed_rows || 0}</div>
                <div className="text-sm text-gray-600">{t('bulkImport.validRows')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{previewData?.errors?.length || 0}</div>
                <div className="text-sm text-gray-600">{t('bulkImport.errors')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{previewData?.warnings?.length || 0}</div>
                <div className="text-sm text-gray-600">{t('bulkImport.warnings')}</div>
              </div>
            </div>

            {/* Errors */}
            {previewData?.errors && previewData.errors.length > 0 && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{t('bulkImport.errorsFound')}:</strong>
                  <ul className="mt-2 space-y-1">
                    {previewData.errors.slice(0, 5).map((error, index) => (
                      <li key={index} className="text-xs">
                        {t('bulkImport.rowError', { row: error.row, error: error.error })}
                      </li>
                    ))}
                    {previewData.errors.length > 5 && (
                      <li className="text-xs text-gray-500">
                        {t('bulkImport.andMoreErrors', { count: previewData.errors.length - 5 })}
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Confirm Import Button */}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleFinalImport}
                disabled={loading || (previewData?.errors && previewData.errors.length > 0)}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {loading ? t('common.processing') : t('bulkImport.confirmImport')}
              </Button>
              
              <Button
                onClick={() => setPreviewData(null)}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t('bulkImport.newPreview')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      {/* Preview Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {t('bulkImport.importPreview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{previewData?.total_rows || 0}</div>
              <div className="text-sm text-gray-600">{t('bulkImport.totalRows')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{previewData?.processed_rows || 0}</div>
              <div className="text-sm text-gray-600">{t('bulkImport.validRows')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{previewData?.errors?.length || 0}</div>
              <div className="text-sm text-gray-600">{t('bulkImport.errors')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{previewData?.warnings?.length || 0}</div>
              <div className="text-sm text-gray-600">{t('bulkImport.warnings')}</div>
            </div>
          </div>

          {/* Errors */}
          {previewData?.errors && previewData.errors.length > 0 && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{t('bulkImport.errorsFound')}:</strong>
                <ul className="mt-2 space-y-1">
                  {previewData.errors.slice(0, 5).map((error, index) => (
                    <li key={index} className="text-xs">
                      {t('bulkImport.rowError', { row: error.row, error: error.error })}
                    </li>
                  ))}
                  {previewData.errors.length > 5 && (
                    <li className="text-xs text-gray-500">
                      {t('bulkImport.andMoreErrors', { count: previewData.errors.length - 5 })}
                    </li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Preview Data */}
      {previewData?.preview_data && previewData.preview_data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('bulkImport.previewData')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{t('bulkImport.row')}</th>
                    <th className="text-left p-2">{t('bulkImport.studentName')}</th>
                    <th className="text-left p-2">{t('bulkImport.arabicName')}</th>
                    <th className="text-left p-2">{t('bulkImport.parentName')}</th>
                    <th className="text-left p-2">{t('bulkImport.studentEmail')}</th>
                    <th className="text-left p-2">{t('bulkImport.parentEmail')}</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.preview_data.slice(0, 10).map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{item.row_number}</td>
                      <td className="p-2 font-medium">{item.student_name}</td>
                      <td className="p-2" dir="rtl">{item.arabic_name}</td>
                      <td className="p-2">{item.parent_name || '-'}</td>
                      <td className="p-2 text-blue-600">{item.predicted_student_email}</td>
                      <td className="p-2 text-green-600">{item.predicted_parent_email || '-'}</td>
                    </tr>
                  ))}
                  {previewData.preview_data.length > 10 && (
                    <tr>
                      <td colSpan={6} className="p-2 text-center text-gray-500">
                        {t('bulkImport.andMoreRows', { count: previewData.preview_data.length - 10 })}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleFinalImport}
          disabled={loading || (previewData?.errors && previewData.errors.length > 0)}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? t('common.importing') : t('bulkImport.confirmImport')}
        </Button>
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {t('bulkImport.importResults')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{importResults?.total_rows || 0}</div>
              <div className="text-sm text-gray-600">{t('bulkImport.totalRows')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{importResults?.successful_imports || 0}</div>
              <div className="text-sm text-gray-600">{t('bulkImport.imported')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{importResults?.created_students?.length || 0}</div>
              <div className="text-sm text-gray-600">{t('bulkImport.studentsCreated')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{importResults?.created_parents?.length || 0}</div>
              <div className="text-sm text-gray-600">{t('bulkImport.parentsCreated')}</div>
            </div>
          </div>

          {importResults?.successful_imports > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {t('bulkImport.importSuccess', {
                  count: importResults.successful_imports
                })}
              </AlertDescription>
            </Alert>
          )}

          {importResults?.errors && importResults.errors.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{t('bulkImport.errorsFound')}:</strong>
                <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                  {importResults.errors.map((error, index) => (
                    <li key={index} className="text-xs">
                      {t('bulkImport.rowError', { row: error.row, error: error.error })}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => navigate('/admin/school-management/students')}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          {t('bulkImport.viewStudents')}
        </Button>
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {t('bulkImport.importMore')}
        </Button>
      </div>
    </div>
  );

  const actions = [
    <Button
      key="back"
      variant="outline"
      onClick={() => navigate('/admin/school-management/students')}
      className="gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      {t('common.back')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('bulkImport.bulkImportStudents')}
      subtitle={t('bulkImport.bulkImportDescription')}
      actions={actions}
      loading={loading && !isImporting}
    >
      <div className="max-w-6xl mx-auto">
        {/* Import Progress Overlay */}
        {isImporting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center">
                {/* Progress Circle */}
                <div className="relative mx-auto mb-6 w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#f3f4f6"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - importProgress / 100)}`}
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {Math.round(importProgress)}%
                    </span>
                  </div>
                </div>

                {/* Progress Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t('bulkImport.importingStudents')}
                  </h3>
                  
                  {/* Current Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">{t('bulkImport.currentStep')}:</p>
                    <p className="font-medium text-gray-900">{importStatus}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>

                  {/* Import Details */}
                  {previewData && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-blue-600 font-medium">{previewData.processed_rows}</div>
                        <div className="text-blue-500">{t('bulkImport.studentsToProcess')}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-green-600 font-medium">
                          {Math.round((importProgress / 100) * previewData.processed_rows)}
                        </div>
                        <div className="text-green-500">{t('bulkImport.studentsProcessed')}</div>
                      </div>
                    </div>
                  )}

                  {/* Job ID Display (for debugging/tracking) */}
                  {importJobId && (
                    <div className="text-xs text-gray-500 text-center">
                      Job ID: {importJobId}
                    </div>
                  )}

                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    {t('bulkImport.pleaseWait')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            {/* Step 1: Structure */}
            <div className={`flex items-center ${currentStep === 'structure' ? 'text-blue-600' : (currentStep === 'template' || currentStep === 'upload' || currentStep === 'results') ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep === 'structure' ? 'bg-blue-100' : (currentStep === 'template' || currentStep === 'upload' || currentStep === 'results') ? 'bg-green-100' : 'bg-gray-100'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">{t('bulkImport.selectStructure')}</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            {/* Step 2: Template */}
            <div className={`flex items-center ${currentStep === 'template' ? 'text-blue-600' : (currentStep === 'upload' || currentStep === 'results') ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep === 'template' ? 'bg-blue-100' : (currentStep === 'upload' || currentStep === 'results') ? 'bg-green-100' : 'bg-gray-100'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">{t('bulkImport.template')}</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            {/* Step 3: Upload */}
            <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep === 'upload' ? 'bg-blue-100' : currentStep === 'results' ? 'bg-green-100' : 'bg-gray-100'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">{t('bulkImport.upload')}</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            {/* Step 4: Results */}
            <div className={`flex items-center ${currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep === 'results' ? 'bg-green-100' : 'bg-gray-100'}`}>
                4
              </div>
              <span className="ml-2 text-sm font-medium">{t('bulkImport.results')}</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'structure' && renderStructureStep()}
        {currentStep === 'template' && renderTemplateStep()}
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'results' && renderResultsStep()}
      </div>
    </AdminPageLayout>
  );
};

export default BulkImportStudentsPage;