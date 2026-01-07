import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Activity, Search } from 'lucide-react';
import TeacherPageLayout from '../../../components/teacher/layout/TeacherPageLayout';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';
import { ProjectCard } from '../../../components/projects/ProjectCard';
import tasksService from '../../../services/tasks';
import { toast } from 'sonner';

const MyProjectsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await tasksService.getMyProjects();
      const projectsList = response.results || response;
      setProjects(Array.isArray(projectsList) ? projectsList : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error(t('error.failedToLoadProjects', 'Failed to load projects'));
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter projects by search
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle project click
  const handleProjectClick = (project) => {
    navigate(`/teacher/projects/${project.id}`);
  };

  return (
    <TeacherPageLayout
      title={t('projects.myProjects', 'My Projects')}
      description={t('projects.myProjectsDescription', 'View and track your assigned projects')}
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('projects.searchProjects', 'Search projects...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Activity className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchQuery
                ? t('projects.noProjectsMatchSearch', 'No projects match your search')
                : t('projects.noProjectsAssigned', 'No projects assigned to you yet')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      )}
    </TeacherPageLayout>
  );
};

export default MyProjectsPage;
