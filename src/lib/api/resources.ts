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

/* ── Org members ─────────────────────────────────────────────────────── */

export const ORG_ROLES = ['viewer', 'member', 'admin'] as const;
export const orgMember = z.object({
	user_id: z.number(),
	email: z.string(),
	name: z.string(),
	role: z.string()
});
export type OrgMember = z.infer<typeof orgMember>;
export const orgMemberList = list(orgMember);

export const registryCred = z.object({
	id: z.number(),
	registry: z.string(),
	username: z.string()
});
export type RegistryCred = z.infer<typeof registryCred>;
export const registryCredList = list(registryCred);

export const githubStatus = z.object({
	enabled: z.boolean(),
	connected: z.boolean(),
	account: z.string().optional(),
	authorize_url: z.string().optional()
});
export type GithubStatus = z.infer<typeof githubStatus>;
export const githubRepo = z.object({
	full_name: z.string(),
	clone_url: z.string(),
	default_branch: z.string(),
	private: z.boolean()
});
export type GithubRepo = z.infer<typeof githubRepo>;
export const githubRepoList = list(githubRepo);

/* ── Services ────────────────────────────────────────────────────────── */

export const SERVICE_TYPES = ['web', 'static', 'worker', 'cron'] as const;
export const INSTANCE_SIZES = ['small', 'medium', 'large', 'xlarge', '2xlarge'] as const;

// Memory + CPU each instance size grants (limits), mirroring the API's instance
// table. Instance size is the memory/CPU lever — there's no separate control.
export const INSTANCE_SPECS: Record<string, { memory: string; cpu: string }> = {
	small: { memory: '256 MiB', cpu: '0.25 vCPU' },
	medium: { memory: '512 MiB', cpu: '1 vCPU' },
	large: { memory: '1 GiB', cpu: '2 vCPU' },
	xlarge: { memory: '4 GiB', cpu: '4 vCPU' },
	'2xlarge': { memory: '8 GiB', cpu: '8 vCPU' }
};

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
	url: z.string().optional().default(''),
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

export const usageSample = z.object({
	cpu_millicores: z.number(),
	memory_bytes: z.number(),
	sampled_at: z.string()
});
export const usage = z.object({
	samples: z
		.array(usageSample)
		.nullable()
		.transform((v) => v ?? []),
	sample_count: z.number(),
	window_seconds: z.number(),
	cpu_core_seconds: z.number(),
	avg_memory_mb: z.number()
});
export type Usage = z.infer<typeof usage>;

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

/* ── Account: API tokens + audit ─────────────────────────────────────── */

export const apiToken = z.object({
	id: z.number(),
	name: z.string(),
	prefix: z.string(),
	created_at: ts,
	last_used_at: z.string().nullable()
});
export type ApiToken = z.infer<typeof apiToken>;
export const apiTokenList = list(apiToken);
/** Create response embeds the one-time plaintext token. */
export const apiTokenCreated = apiToken.extend({ token: z.string() });
export type ApiTokenCreated = z.infer<typeof apiTokenCreated>;

export const auditEntry = z.object({
	id: z.number(),
	method: z.string(),
	path: z.string(),
	status: z.number(),
	created_at: ts
});
export type AuditEntry = z.infer<typeof auditEntry>;
export const auditList = list(auditEntry);

export const auditPage = z.object({
	items: z
		.array(auditEntry)
		.nullable()
		.transform((v) => v ?? []),
	total: z.number(),
	limit: z.number(),
	offset: z.number()
});
export type AuditPage = z.infer<typeof auditPage>;
