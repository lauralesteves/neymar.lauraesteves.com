S3_BUCKET := neymar.lauraesteves.com
CLOUDFRONT_DISTRIBUTION_ID := $(shell aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[?contains(@, '$(S3_BUCKET)')]] | [0].Id" --output text)

export AWS_PAGER :=

.PHONY: build deploy clean server

## Servidor de desenvolvimento
server:
	yarn dev

## Build do site Vite
build:
	bun run build

## Build + Deploy para S3 + invalidação do CloudFront
deploy: build
	@echo "Deploying to s3://$(S3_BUCKET)..."
	aws s3 sync dist/ s3://$(S3_BUCKET) \
		--delete \
		--cache-control "public, max-age=31536000, immutable" \
		--exclude "*.html" \
		--exclude "robots.txt" \
		--exclude "site.webmanifest" \
		--exclude "browserconfig.xml" \
		--exclude "ai.txt" \
		--exclude "humans.txt" \
		--exclude ".well-known/*"
	aws s3 sync dist/ s3://$(S3_BUCKET) \
		--delete \
		--cache-control "public, max-age=3600" \
		--exclude "*" \
		--include "*.html" \
		--include "robots.txt" \
		--include "site.webmanifest" \
		--include "browserconfig.xml" \
		--include "ai.txt" \
		--include "humans.txt" \
		--include ".well-known/*"
	@echo "Invalidating CloudFront cache..."
	aws cloudfront create-invalidation \
		--distribution-id $(CLOUDFRONT_DISTRIBUTION_ID) \
		--paths "/*"
	@echo "Deploy complete!"

## Limpar diretório de build
clean:
	rm -rf dist/
