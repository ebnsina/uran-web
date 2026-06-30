/**
 * Query keys + typed fetch/mutation functions for every dashboard resource,
 * all going through the /api/v1/* proxy. Centralised so invalidation stays
 * consistent (e.g. creating a service invalidates qk.services(projectId)).
 */
import {
	projectList,
	project,
	serviceList,
	service,
	serviceStatusList,
	deployList,
	deploy,
	envList,
	domainList,
	domain,
	metricsList,
	databaseList,
	database,
	dbConnection,
	backupList,
	type Project,
	type Service,
	type Deploy,
	type Domain,
	type Database,
	type DbConnection
} from '$lib/api/resources';
import { apiGet, apiPost, apiDelete } from './fetcher';

const v1 = '/api/v1';

/* ── Query keys ──────────────────────────────────────────────────────── */
export const qk = {
	projects: (orgId: number) => ['orgs', orgId, 'projects'] as const,
	project: (id: number) => ['projects', id] as const,
	services: (projectId: number) => ['projects', projectId, 'services'] as const,
	projectStatus: (projectId: number) => ['projects', projectId, 'status'] as const,
	service: (id: number) => ['services', id] as const,
	deploys: (serviceId: number) => ['services', serviceId, 'deploys'] as const,
	deploy: (id: number) => ['deploys', id] as const,
	env: (serviceId: number) => ['services', serviceId, 'env'] as const,
	domains: (serviceId: number) => ['services', serviceId, 'domains'] as const,
	metrics: (serviceId: number) => ['services', serviceId, 'metrics'] as const,
	databases: (projectId: number) => ['projects', projectId, 'databases'] as const,
	database: (id: number) => ['databases', id] as const,
	dbConnection: (id: number) => ['databases', id, 'connection'] as const,
	backups: (id: number) => ['databases', id, 'backups'] as const
};

/* ── Projects ────────────────────────────────────────────────────────── */
export const getProjects = (orgId: number) => apiGet(`${v1}/orgs/${orgId}/projects`, projectList);
export const createProject = (orgId: number, name: string): Promise<Project> =>
	apiPost(`${v1}/orgs/${orgId}/projects`, { name }, project);

/* ── Services ────────────────────────────────────────────────────────── */
export const getServices = (projectId: number) =>
	apiGet(`${v1}/projects/${projectId}/services`, serviceList);
export const getProjectStatus = (projectId: number) =>
	apiGet(`${v1}/projects/${projectId}/status`, serviceStatusList);
export const getService = (id: number) => apiGet(`${v1}/services/${id}`, service);

export interface CreateServiceInput {
	name: string;
	type: string;
	repo_url: string;
	branch?: string;
	schedule?: string;
}
export const createService = (projectId: number, input: CreateServiceInput): Promise<Service> =>
	apiPost(`${v1}/projects/${projectId}/services`, input, service);

export const suspendService = (id: number) => apiPost(`${v1}/services/${id}/suspend`);
export const resumeService = (id: number) => apiPost(`${v1}/services/${id}/resume`);
export const scaleService = (
	id: number,
	body: { replicas?: number; instance_size?: string; min_replicas?: number; max_replicas?: number }
) => apiPost(`${v1}/services/${id}/scale`, body);
export const setHealthPath = (id: number, path: string) =>
	apiPost(`${v1}/services/${id}/health`, { path });

/* ── Deploys ─────────────────────────────────────────────────────────── */
export const getDeploys = (serviceId: number) =>
	apiGet(`${v1}/services/${serviceId}/deploys`, deployList);
export const getDeploy = (id: number) => apiGet(`${v1}/deploys/${id}`, deploy);
export const triggerDeploy = (serviceId: number, commit_sha?: string): Promise<Deploy> =>
	apiPost(`${v1}/services/${serviceId}/deploys`, commit_sha ? { commit_sha } : {}, deploy);
export const imageDeploy = (serviceId: number, image: string): Promise<Deploy> =>
	apiPost(`${v1}/services/${serviceId}/image-deploys`, { image }, deploy);
export const rollbackDeploy = (deployId: number): Promise<Deploy> =>
	apiPost(`${v1}/deploys/${deployId}/rollback`, {}, deploy);

/* ── Env vars ────────────────────────────────────────────────────────── */
export const getEnv = (serviceId: number) => apiGet(`${v1}/services/${serviceId}/env`, envList);
export const setEnv = (
	serviceId: number,
	body: { key: string; value: string; secret: boolean; build_time: boolean }
) => apiPost(`${v1}/services/${serviceId}/env`, body);
export const deleteEnv = (serviceId: number, key: string) =>
	apiDelete(`${v1}/services/${serviceId}/env/${encodeURIComponent(key)}`);

/* ── Domains ─────────────────────────────────────────────────────────── */
export const getDomains = (serviceId: number) =>
	apiGet(`${v1}/services/${serviceId}/domains`, domainList);
export const addDomain = (serviceId: number, d: string): Promise<Domain> =>
	apiPost(`${v1}/services/${serviceId}/domains`, { domain: d }, domain);
export const deleteDomain = (serviceId: number, d: string) =>
	apiDelete(`${v1}/services/${serviceId}/domains/${encodeURIComponent(d)}`);

/* ── Observability ───────────────────────────────────────────────────── */
export const getMetrics = (serviceId: number) =>
	apiGet(`${v1}/services/${serviceId}/metrics`, metricsList);

/* ── Databases ───────────────────────────────────────────────────────── */
export const getDatabases = (projectId: number) =>
	apiGet(`${v1}/projects/${projectId}/databases`, databaseList);
export const getDatabase = (id: number) => apiGet(`${v1}/databases/${id}`, database);
export const getDbConnection = (id: number): Promise<DbConnection> =>
	apiGet(`${v1}/databases/${id}/connection`, dbConnection);

export interface CreateDatabaseInput {
	name: string;
	engine: string;
	tier: string;
	instances?: number;
	min_instances?: number;
	max_instances?: number;
	size: string;
	storage: string;
	pooling: boolean;
	backups: boolean;
}
export const createDatabase = (projectId: number, input: CreateDatabaseInput): Promise<Database> =>
	apiPost(`${v1}/projects/${projectId}/databases`, input, database);
export const scaleDatabase = (
	id: number,
	body: { instances?: number; size?: string; storage?: string }
) => apiPost(`${v1}/databases/${id}/scale`, body);
export const getBackups = (id: number) => apiGet(`${v1}/databases/${id}/backups`, backupList);
export const triggerBackup = (id: number) => apiPost(`${v1}/databases/${id}/backups`);
export const deleteDatabase = (id: number) => apiDelete(`${v1}/databases/${id}`);
