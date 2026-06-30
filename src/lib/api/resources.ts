/**
 * Zod schemas + types for the dashboard's API resources. Mirrors the uran-api
 * contract exactly (field names, optionality). List endpoints can return `null`
 * for empty (Go nil slice), so `list()` normalises null → [].
 */
import { z } from 'zod';

const ts = z.string();
/** Array schema that tolerates the API's null-for-empty. */
const list = <T>(s: z.ZodType<T>) =>
	z
		.array(s)
		.nullable()
		.transform((v) => v ?? []);

/* ── Projects ────────────────────────────────────────────────────────── */

export const project = z.object({
	id: z.number(),
	org_id: z.number(),
	name: z.string(),
	slug: z.string(),
	created_at: ts
});
export type Project = z.infer<typeof project>;
export const projectList = list(project);

/* ── Services ────────────────────────────────────────────────────────── */

export const SERVICE_TYPES = ['web', 'static', 'worker', 'cron'] as const;
export const INSTANCE_SIZES = ['small', 'medium', 'large', 'xlarge', '2xlarge'] as const;

export const service = z.object({
	id: z.number(),
	project_id: z.number(),
	name: z.string(),
	slug: z.string(),
	type: z.string(),
	repo_url: z.string(),
	branch: z.string(),
	schedule: z.string().optional().default(''),
	replicas: z.number(),
	instance_size: z.string(),
	health_path: z.string().optional().default(''),
	min_replicas: z.number(),
	max_replicas: z.number(),
	disk_size: z.string().optional().default(''),
	disk_path: z.string().optional().default(''),
	suspended: z.boolean(),
	created_at: ts,
	internal_host: z.string().optional().default('')
});
export type Service = z.infer<typeof service>;
export const serviceList = list(service);

export const serviceStatus = z.object({
	service_id: z.number(),
	name: z.string(),
	type: z.string(),
	suspended: z.boolean(),
	status: z.string()
});
export type ServiceStatus = z.infer<typeof serviceStatus>;
export const serviceStatusList = list(serviceStatus);

/* ── Deploys ─────────────────────────────────────────────────────────── */

export const DEPLOY_STATUSES = ['queued', 'building', 'deploying', 'live', 'failed'] as const;

export const deploy = z.object({
	id: z.number(),
	service_id: z.number(),
	status: z.string(),
	commit_sha: z.string(),
	image: z.string(),
	kind: z.string(),
	pr_number: z.number().nullish(),
	created_at: ts,
	updated_at: ts
});
export type Deploy = z.infer<typeof deploy>;
export const deployList = list(deploy);

/* ── Env vars ────────────────────────────────────────────────────────── */

export const envVar = z.object({
	key: z.string(),
	value: z.string(),
	secret: z.boolean(),
	build_time: z.boolean()
});
export type EnvVar = z.infer<typeof envVar>;
export const envList = list(envVar);

/* ── Domains ─────────────────────────────────────────────────────────── */

export const domain = z.object({
	id: z.number(),
	service_id: z.number(),
	domain: z.string()
});
export type Domain = z.infer<typeof domain>;
export const domainList = list(domain);

/* ── Observability ───────────────────────────────────────────────────── */

export const podMetric = z.object({
	pod: z.string(),
	cpu_millicores: z.number(),
	memory_bytes: z.number()
});
export type PodMetric = z.infer<typeof podMetric>;
export const metricsList = list(podMetric);

/* ── Databases ───────────────────────────────────────────────────────── */

export const DB_ENGINES = ['postgres', 'redis'] as const;
export const DB_TIERS = ['standard', 'autoscale'] as const;
export const STORAGE_OPTIONS = [
	'1Gi',
	'5Gi',
	'10Gi',
	'25Gi',
	'50Gi',
	'100Gi',
	'250Gi',
	'500Gi'
] as const;

export const database = z.object({
	id: z.number(),
	project_id: z.number(),
	name: z.string(),
	slug: z.string(),
	engine: z.string(),
	status: z.string(),
	tier: z.string(),
	instances: z.number(),
	min_instances: z.number(),
	max_instances: z.number(),
	size: z.string(),
	storage: z.string(),
	pooling: z.boolean(),
	backups: z.boolean()
});
export type Database = z.infer<typeof database>;
export const databaseList = list(database);

export const dbConnection = z.object({
	uri: z.string(),
	read_uri: z.string().optional(),
	pooled_uri: z.string().optional()
});
export type DbConnection = z.infer<typeof dbConnection>;

export const backupInfo = z.object({
	name: z.string(),
	phase: z.string(),
	started_at: z.string().optional(),
	stopped_at: z.string().optional()
});
export type BackupInfo = z.infer<typeof backupInfo>;
export const backupList = list(backupInfo);
