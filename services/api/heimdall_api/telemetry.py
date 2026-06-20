"""OpenTelemetry kurulumu. OTLP endpoint tanımlı değilse no-op (opsiyonel gözlem)."""

from __future__ import annotations

from fastapi import FastAPI

from .config import settings


def setup_telemetry(app: FastAPI) -> None:
    endpoint = settings.otel_exporter_otlp_endpoint
    if not endpoint:
        return  # Gözlem opsiyonel — collector yoksa sessizce geç.

    from opentelemetry import trace
    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
    from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
    from opentelemetry.sdk.resources import Resource
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    resource = Resource.create({"service.name": settings.otel_service_name})
    provider = TracerProvider(resource=resource)
    provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(endpoint=endpoint)))
    trace.set_tracer_provider(provider)
    FastAPIInstrumentor.instrument_app(app)
