import { MoreVertical, Edit, Trash2, Calendar, User, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { formatDistanceToNow, isPast, format } from 'date-fns';

export function ProjectTaskList({ tasks, canEdit = false, onTaskUpdate, onTaskDelete, onTaskEdit }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Status configuration
  const statusConfig = {
    TODO: {
      label: t('projectTasks.status.todo', 'To Do'),
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
    },
    IN_PROGRESS: {
      label: t('projectTasks.status.inProgress', 'In Progress'),
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    IN_REVIEW: {
      label: t('projectTasks.status.inReview', 'In Review'),
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
    },
    COMPLETED: {
      label: t('projectTasks.status.completed', 'Completed'),
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
  };

  // Priority configuration
  const priorityConfig = {
    LOW: {
      label: t('projectTasks.priority.low', 'Low'),
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
    },
    MEDIUM: {
      label: t('projectTasks.priority.medium', 'Medium'),
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    HIGH: {
      label: t('projectTasks.priority.high', 'High'),
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
    },
    CRITICAL: {
      label: t('projectTasks.priority.critical', 'Critical'),
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
    },
  };

  // Get localized task title
  const getLocalizedTitle = (task) => {
    if (isRTL && task.title_arabic) return task.title_arabic;
    if (i18n.language === 'fr' && task.title_french) return task.title_french;
    return task.title;
  };

  // Get user initials
  const getInitials = (user) => {
    if (!user) return 'NA';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Handle status change
  const handleStatusChange = (taskId, newStatus) => {
    onTaskUpdate?.(taskId, { status: newStatus });
  };

  // Format due date
  const formatDueDate = (dueDate) => {
    if (!dueDate) return t('common.notSet', 'Not set');
    const date = new Date(dueDate);
    const isOverdue = isPast(date);

    return (
      <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
        {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
        <span className="text-sm">
          {formatDistanceToNow(date, { addSuffix: true })}
        </span>
      </div>
    );
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">
          {t('projectTasks.noTasks', 'No tasks found')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('projectTasks.title', 'Title')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('projectTasks.assignedTo', 'Assigned To')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('projectTasks.status', 'Status')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('projectTasks.priority', 'Priority')}
            </TableHead>
            <TableHead className={isRTL ? 'text-right' : 'text-left'}>
              {t('projectTasks.dueDate', 'Due Date')}
            </TableHead>
            {canEdit && (
              <TableHead className="text-center w-[80px]">
                {t('common.actions', 'Actions')}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const dueDate = task.due_date ? new Date(task.due_date) : null;
            const isOverdue = dueDate && isPast(dueDate) && task.status !== 'COMPLETED';

            return (
              <TableRow
                key={task.id}
                className={`
                  ${isOverdue ? 'bg-red-50/50 dark:bg-red-900/10' : ''}
                  hover:bg-gray-50 dark:hover:bg-gray-800
                `}
              >
                {/* Title */}
                <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="max-w-[300px]">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {getLocalizedTitle(task)}
                    </p>
                    {task.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Assigned To */}
                <TableCell>
                  {task.assigned_to ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={task.assigned_to.profile_picture} alt={task.assigned_to.first_name} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(task.assigned_to)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {task.assigned_to.first_name} {task.assigned_to.last_name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">
                      {t('common.unassigned', 'Unassigned')}
                    </span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {canEdit ? (
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(task.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${config.bgColor}`} />
                              <span>{config.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${statusConfig[task.status]?.bgColor} ${statusConfig[task.status]?.textColor} border-0`}>
                      {statusConfig[task.status]?.label}
                    </Badge>
                  )}
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <Badge className={`${priorityConfig[task.priority]?.bgColor} ${priorityConfig[task.priority]?.textColor} border-0`}>
                    {priorityConfig[task.priority]?.label}
                  </Badge>
                </TableCell>

                {/* Due Date */}
                <TableCell>
                  {formatDueDate(task.due_date)}
                </TableCell>

                {/* Actions */}
                {canEdit && (
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">{t('common.actions', 'Actions')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onTaskEdit?.(task)}>
                          <Edit className="w-4 h-4" />
                          <span>{t('common.edit', 'Edit')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onTaskDelete?.(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>{t('common.delete', 'Delete')}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
