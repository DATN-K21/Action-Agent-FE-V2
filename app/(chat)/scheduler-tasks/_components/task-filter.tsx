import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SchedulerTaskStatus, SchedulerTaskTypes } from '@/constants/scheduler-task';
import { displayEnum } from '@/lib/utils';
import { SchedulerTaskFilterProps } from '@/services/scheduler-service';
import { IAssistant, ITeamProps } from '@/types/assistant';
import React, { useMemo, useState } from 'react';

export interface ISchedulerTaskFilterProps {
  assistants: IAssistant[];
  updateFilter: (filter: SchedulerTaskFilterProps) => void;
}

function SchedulerTaskFilter(props: ISchedulerTaskFilterProps) {
  const { assistants, updateFilter } = props;

  const [selectedAssistant, setSelectedAssistant] = useState<IAssistant | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<ITeamProps | null>(null);

  const [filter, setFilter] = useState<SchedulerTaskFilterProps>({
    skip: 0,
    limit: 100,
  });
  const teams = useMemo<ITeamProps[]>((): ITeamProps[] => {
    if (filter.assistant_id) {
      return assistants.find((assistant) => assistant.id === filter.assistant_id)?.teams || [];
    }
    return [];
  }, [filter.assistant_id, assistants]);

  const onChangeFilter = (field: string, value: any) => {
    if (field === 'assistant_id') {
      setSelectedAssistant(assistants.find((a) => a.id === value) || null);
    }
    if (field === 'team_id') {
      setSelectedTeam(teams.find((t) => t.id === value) || null);
    }

    setFilter((prev) => ({ ...prev, [field]: value === 'all' ? undefined : value }));
    updateFilter({ ...filter, [field]: value === 'all' ? undefined : value });
  };

  return (
    <div className="w-full my-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {/* Assistant */}
        <Select
          value={filter.assistant_id || 'all'}
          onValueChange={(value) => onChangeFilter('assistant_id', value)}
        >
          <SelectTrigger className="w-full sm:w-40 lg:w-44">
            <SelectValue placeholder="Assistant">
              {filter.assistant_id === 'All'
                ? 'All Assistants'
                : displayEnum(selectedAssistant?.name || 'All Assistants')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assistants</SelectItem>

            {assistants.map((assistant) => (
              <SelectItem key={assistant.id} value={assistant.id}>
                {assistant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Team */}
        <Select
          value={filter.team_id || 'all'}
          onValueChange={(value) => onChangeFilter('team_id', value)}
        >
          <SelectTrigger className="w-full sm:w-40 lg:w-44">
            <SelectValue placeholder="Team">
              {filter.team_id === 'all'
                ? 'All Teams'
                : displayEnum(selectedTeam?.name?.replace(selectedTeam?.id, '') || 'All Teams')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {displayEnum(team.name.replace(team.id, ''))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {/* Status */}
        <Select
          value={filter.status || 'all'}
          onValueChange={(value) => onChangeFilter('status', value)}
        >
          <SelectTrigger className="w-full sm:w-32 lg:w-36">
            <SelectValue placeholder="Status">
              {filter.status ? displayEnum(filter.status) : 'All Statuses'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>

            {Object.values(SchedulerTaskStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {displayEnum(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Job Type */}
        <Select
          value={filter.job_type || 'all'}
          onValueChange={(value) => onChangeFilter('job_type', value)}
        >
          <SelectTrigger className="w-full sm:w-32 lg:w-36">
            <SelectValue placeholder="Job Type">
              {filter.job_type ? displayEnum(filter.job_type) : 'All Types'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>

            {Object.values(SchedulerTaskTypes).map((jobType) => (
              <SelectItem key={jobType} value={jobType}>
                {displayEnum(jobType)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default SchedulerTaskFilter;
