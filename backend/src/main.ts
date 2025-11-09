// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { AllExceptionsFilter } from "./common/filters/all-exception.filter";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api");
    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // bỏ field lạ
            forbidNonWhitelisted: true,
            transform: true, // auto transform kiểu
        })
    );

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());

    const config = new DocumentBuilder()
        .setTitle("User API")
        .setDescription("Example NestJS API")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);

    // 7️⃣ Start app
    await app.listen(3000);
    console.log(`🚀 API running at: http://localhost:3000/api`);
    console.log(`📘 Swagger docs: http://localhost:3000/docs`);
}
bootstrap();
