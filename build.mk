REGISTRY_PATH ?= harbor.sun-asterisk.vn/geu/splan
TAG ?= latest

LARAVEL_IMAGE=$(REGISTRY_PATH)/laravel-app
API_IMAGE=$(REGISTRY_PATH)/api
WEB_BUILD_IMAGE=$(REGISTRY_PATH)/web-build
WEB_IMAGE=$(REGISTRY_PATH)/web

build-web:
	docker build web \
		-f deploy/dockerfiles/web/Dockerfile \
		-t $(WEB_BUILD_IMAGE):$(TAG) \
		--target=build
	docker build web \
		-f deploy/dockerfiles/web/Dockerfile \
		-t $(WEB_IMAGE):$(TAG)

build-api:
	docker build api \
		-f deploy/dockerfiles/api/laravel.Dockerfile \
		-t $(LARAVEL_IMAGE):$(TAG) \
		--cache-from $(LARAVEL_IMAGE):$(TAG)
	docker build deploy/dockerfiles/api \
		-t $(API_IMAGE):$(TAG) \
		--build-arg REGISTRY_PATH=$(REGISTRY_PATH) \
		--build-arg TAG=$(TAG) \
		--cache-from $(LARAVEL_IMAGE):$(TAG) \
		--cache-from $(API_IMAGE):$(TAG)

build: build-web build-api

pull:
	docker pull $(WEB_BUILD_IMAGE):$(TAG)
	docker pull $(WEB_IMAGE):$(TAG)
	docker pull $(LARAVEL_IMAGE):$(TAG)
	docker pull $(API_IMAGE):$(TAG)

push:
	docker push $(WEB_BUILD_IMAGE):$(TAG)
	docker push $(WEB_IMAGE):$(TAG)
	docker push $(LARAVEL_IMAGE):$(TAG)
	docker push $(API_IMAGE):$(TAG)
ifdef UNIQUE_TAG
	docker tag $(WEB_IMAGE):$(TAG) $(WEB_IMAGE):$(UNIQUE_TAG)
	docker push $(WEB_IMAGE):$(UNIQUE_TAG)
	docker tag $(API_IMAGE):$(TAG) $(API_IMAGE):$(UNIQUE_TAG)
	docker push $(API_IMAGE):$(UNIQUE_TAG)
endif

CM_AUTH := $(shell cat deploy/charts/auth 2>/dev/null)

ifneq "$(CM_AUTH)" ""
	cm_auth_parts = $(subst :, ,$(CM_AUTH))
	export cm_auth_str := -u "$(word 1,$(cm_auth_parts))" -p "$(word 2,$(cm_auth_parts))"
endif

CHART_REPO ?= https://harbor.sun-asterisk.vn/chartrepo/geu

chart-deps:
	@helm dep update deploy/charts/splan

push-chart:
	@helm cm-push $(cm_auth_str) deploy/charts/splan $(CHART_REPO)
