import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export interface AISuggestion {
    id: string;
    level: "polite" | "casual" | "formal";
    levelLabel: string;
    text: string;
}

export interface AICheckResponse {
    culturalNotes: string;
    suggestions: AISuggestion[];
}

const GEMINI_PROMPT = `あなたは日本語と日本文化の専門家です。以下の条件を厳密に守ってください：

1. ユーザーが入力したテキストを分析する
2. 文法、敬語、文化的な注意点を確認する
3. 出力は**必ずJSON形式のみ**にしてください
4. suggestions.text以外の説明な文章は絶対に書かない
5. 「culturalNotes」は、10 行以内の短い段落にする必要があります。

JSON形式は次の通り：
{
  "culturalNotes": "文化的・文法的な注意点をベトナム語で簡潔に説明してください",
  "suggestions": [
    { "id": "1", "level": "polite", "levelLabel": "敬語/丁寧", "text": "丁寧な表現..." },
    { "id": "2", "level": "casual", "levelLabel": "普通/カジュアル", "text": "普通の表現..." }
  ]
}

分析するテキスト：
`;

const AICheckResponseSchema = z.object({
    culturalNotes: z.string(),
    suggestions: z.array(
        z.object({
            id: z.string(),
            level: z.enum(["polite", "casual", "formal"]),
            levelLabel: z.string(),
            text: z.string(),
        })
    ),
});

@Injectable()
export class AIService {
    private readonly logger = new Logger(AIService.name);
    private aiModel?: GoogleGenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>("GEMINI_API_KEY");
        if (!apiKey) {
            this.logger.warn("GEMINI_API_KEY not configured");
            return;
        }
        this.aiModel = new GoogleGenAI({ apiKey });
    }

    async checkCulture(text: string): Promise<AICheckResponse> {
        if (!this.aiModel) {
            return this.getDefaultResponse("AI service is not configured.");
        }

        if (!text?.trim()) {
            return this.getDefaultResponse("Content is empty.");
        }

        const safeText = text.slice(0, 1000);

        try {
            const result = await this.aiModel.models.generateContent({
                model: "gemini-2.5-flash",
                contents: GEMINI_PROMPT + safeText,
                config: {
                    responseMimeType: "application/json",
                    temperature: 0.7,
                },
            });

            const responseText = result.text;
            if (!responseText) {
                throw new Error("Gemini returned empty response");
            }

            return JSON.parse(responseText);
        } catch (error) {
            this.logger.error("Gemini error", error);
            return this.getDefaultResponse();
        }
    }

    private getDefaultResponse(note = "Try again later."): AICheckResponse {
        return {
            culturalNotes: note,
            suggestions: [],
        };
    }
}
