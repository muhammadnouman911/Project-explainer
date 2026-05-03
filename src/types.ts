/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface RepoAnalysis {
  summary: string;
  keyFeatures: string[];
  techStack: string[];
  beginnerExplanation: string;
}

export interface AnalysisState {
  [repoId: number]: {
    loading: boolean;
    error: string | null;
    analysis: RepoAnalysis | null;
  };
}
