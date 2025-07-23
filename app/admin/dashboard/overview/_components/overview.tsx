'use client';

import { RankingUser } from './ranking-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getStatisticOverview, getStatisticsRanking } from '@/services/admin-service';
import { User } from 'next-auth';
import { useEffect, useState, useCallback } from 'react';
import { RankingExtension } from './ranking-extension';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface OverViewPageProps {
  user: User;
}

const PERIODS = [
  'day',
  'yesterday',
  'week',
  'month',
  'quarter',
  'year',
  'last_7_days',
  'last_30_days',
] as string[];

export default function OverViewPage(props: OverViewPageProps) {
  const { user } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataOverview, setDataOverview] = useState<any>(null);
  const [dataRanking, setDataRanking] = useState<any>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  const fetchDataOverview = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await getStatisticOverview({ user, period: selectedPeriod });
      const { users, connectedExtensions } = await getStatisticsRanking({
        user,
        period: selectedPeriod,
      });
      setDataOverview(response);
      setDataRanking({
        users: users,
        connectedExtensions: connectedExtensions,
      });
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedPeriod]);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchDataOverview();
  }, [user, fetchDataOverview]);

  return (
    // <PageContainer scrollable>
    <div className="space-y-2 p-3">
      <div className="w-full flex flex-col items-start justify-center space-y-2">
        <Link href="/" className="flex flex-row gap-3 items-center justify-start">
          <Image
            src="/images/logo.png"
            alt="Action Agent Logo"
            width={112} // 28*4 = 112px, roughly h-14
            height={56} // arbitrary, adjust as needed
            className="h-14 w-auto px-2 rounded-md cursor-pointer"
            style={{ maxHeight: '3.5rem' }}
            priority
          />
        </Link>
        <div className="w-full flex items-center justify-between space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Hi, Welcome back 👋</h2>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-40 lg:w-44">
              <SelectValue placeholder="Period"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              {PERIODS.map((period) => (
                <SelectItem key={period} value={period}>
                  {period.charAt(0).toUpperCase() + period.slice(1).replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="shadow" />

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="size-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : dataOverview?.users.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {dataOverview?.users.percentageChange} from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Extensions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="size-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : dataOverview?.connectedExtensions.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {dataOverview?.connectedExtensions.percentageChange} from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threads</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="size-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : dataOverview?.threads.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {dataOverview?.threads.percentageChange} from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assistants</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="size-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : dataOverview?.assistants.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {dataOverview?.assistants.percentageChange} since last period
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 User</CardTitle>
            <CardDescription>The most score of user</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading...</div>
            ) : (
              <RankingUser data={dataRanking?.users} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Extensions</CardTitle>
            <CardDescription>Most used extensions in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading...</div>
            ) : (
              <RankingExtension data={dataRanking?.connectedExtensions} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    // </PageContainer>
  );
}
