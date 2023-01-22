{{- define "splan.images.api" -}}
{{- include "common.images.image" (dict "imageRoot" .Values.api.image) -}}
{{- end -}}

{{- define "splan.images.web" -}}
{{- include "common.images.image" (dict "imageRoot" .Values.web.image) -}}
{{- end -}}

{{- define "splan.images.pullSecrets" -}}
{{- $images := list .Values.api.image .Values.web.image -}}
{{- include "common.images.pullSecrets" (dict "images" $images "global" .Values.global) -}}
{{- end -}}

{{- define "splan.checksums.appConfig" -}}
checksum/configmap: {{ include (print $.Template.BasePath "/api/configmap.yaml") . | sha256sum }}
checksum/secret: {{ include (print $.Template.BasePath "/api/secret.yaml") . | sha256sum }}
{{- end -}}

{{- define "splan.laravel.env" -}}
- configMapRef:
    name: {{ template "common.names.fullname" . }}
- secretRef:
    name: {{ template "common.names.fullname" . }}
{{- end -}}

{{- define "splan.beanstalkd.host" -}}
  {{- if eq .Values.beanstalkd.enabled true -}}
    {{- printf "%s-%s" .Release.Name "beanstalkd" | trunc 63 | trimSuffix "-" -}}
  {{- else -}}
    {{- .Values.api.config.beanstalkd.host -}}
  {{- end -}}
{{- end -}}

{{- define "splan.db.host" -}}
  {{- if eq .Values.mariadb.enabled true -}}
    {{- printf "%s-%s" .Release.Name "mariadb" | trunc 63 | trimSuffix "-" -}}
  {{- else -}}
    {{- .Values.api.config.db.host -}}
  {{- end -}}
{{- end -}}

{{- define "splan.db.port" -}}
  {{- if eq .Values.mariadb.enabled true -}}
    {{- printf "%d" .Values.mariadb.service.port -}}
  {{- else -}}
    {{- .Values.api.config.db.port -}}
  {{- end -}}
{{- end }}

{{- define "splan.db.database" -}}
  {{- if eq .Values.mariadb.enabled true -}}
    {{- .Values.mariadb.mariadbDatabase -}}
  {{- else -}}
    {{- .Values.api.config.db.database -}}
  {{- end -}}
{{- end }}

{{- define "splan.db.username" -}}
  {{- if eq .Values.mariadb.enabled true -}}
    {{- .Values.mariadb.mariadbUsername -}}
  {{- else -}}
    {{- .Values.api.config.db.username -}}
  {{- end -}}
{{- end }}

{{- define "splan.db.password" -}}
  {{- if eq .Values.mariadb.enabled true -}}
    {{- .Values.mariadb.auth.password | required ".Values.mariadb.auth.password is required" -}}
  {{- else -}}
    {{- .Values.api.config.db.password -}}
  {{- end -}}
{{- end }}

{{- define "splan.redis.host" -}}
  {{- if eq .Values.redis.enabled true -}}
    {{- printf "%s-%s" .Release.Name "redis" | trunc 63 | trimSuffix "-" -}}-master
  {{- else -}}
    {{- .Values.api.config.redis.host -}}
  {{- end -}}
{{- end -}}

{{- define "splan.redis.port" -}}
  {{- if eq .Values.redis.enabled true -}}
    {{- printf "%d" .Values.redis.master.service.port -}}
  {{- else -}}
    {{- .Values.api.config.redis.port -}}
  {{- end -}}
{{- end -}}

{{- define "splan.redis.password" -}}
  {{- if not .Values.redis.enabled  -}}
    {{- .Values.api.config.redis.password -}}
  {{- else if .Values.redis.usePassword -}}
    {{- .Values.redis.password | required ".Values.redis.password is required" -}}
  {{- end -}}
{{- end -}}
