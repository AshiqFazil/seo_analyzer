import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

class GeminiChatbot:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY2")
        if not self.api_key:
            print("❌ GEMINI_API_KEY2 not found in environment variables")
        self.endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

    def ask(self, user_message, seo_report=None):
        if not self.api_key:
            return {'reply': "Twinkle is unavailable: Gemini API key not configured."}

        headers = {
            "Content-Type": "application/json"
        }

        
        system_prompt = (
            "You are Twinkle, an expert SEO assistant chatbot. "
            "You help users understand their website's SEO report and provide actionable advice. "
            "Be friendly, concise, and focus on SEO best practices. "
            "If the user provides a report, use it to give specific suggestions. "
            "Keep responses conversational and helpful. "
            "IMPORTANT FORMATTING RULES: "
            "1. Use <br> for line breaks "
            "2. Use <strong>text</strong> for bold important terms "
            "3. Use bullet points with <br>• for lists "
            "4. Make headings bold like <strong>Heading:</strong><br> "
            "5. Add spacing between sections with <br><br> "
            "6. Format key points as <strong>Key Point:</strong> description "
            "7. Use <br> for better readability throughout the response."
        )

        
        full_prompt = system_prompt + "\n\n"
        if seo_report:
            full_prompt += f"SEO Report Context: {seo_report}\n\n"
        full_prompt += f"User Question: {user_message}\n\nTwinkle's Response:"

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": full_prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1000,
            }
        }

        try:
            print("🤖 Making request to Gemini API for chatbot...")
            response = requests.post(
                f"{self.endpoint}?key={self.api_key}",
                headers=headers,
                json=payload,
                timeout=30
            )

            print(f"📊 Gemini chatbot response status: {response.status_code}")
            
            if response.status_code != 200:
                print("❌ Gemini API Error:", response.text)
                return {'reply': "Twinkle is having trouble connecting to the AI service right now. Please try again later."}

            result = response.json()
            
            if "candidates" in result and len(result["candidates"]) > 0:
                candidate = result["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    ai_response = candidate["content"]["parts"][0]["text"]
                    print(f"✅ Successfully got Gemini chatbot response ({len(ai_response)} characters)")
                    
                   
                    cleaned_response = ai_response.strip()
                    if cleaned_response.startswith("Twinkle's Response:"):
                        cleaned_response = cleaned_response.replace("Twinkle's Response:", "").strip()
                    
                    
                    cleaned_response = self.format_response(cleaned_response)
                    
                    return {'reply': cleaned_response}
                    
                else:
                    print("❌ Unexpected response structure - no content/parts found")
                    return {'reply': "Twinkle is having trouble processing the response. Please try again."}
            else:
                print("❌ No candidates in response")
                return {'reply': "Twinkle is temporarily unavailable. Please try again later."}
                
        except requests.exceptions.Timeout:
            print("❌ Request timeout")
            return {'reply': "Twinkle is taking too long to respond. Please try again."}
        except requests.exceptions.RequestException as e:
            print(f"❌ Request error: {e}")
            return {'reply': "Twinkle is having trouble connecting to the AI service right now. Please try again later."}
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return {'reply': "Twinkle encountered an unexpected error. Please try again later."}
    
    def format_response(self, response):
        """Post-process the response to ensure proper formatting"""
        
        response = response.replace('\n•', '<br>•')
        response = response.replace('\n-', '<br>•')
        
        
        response = response.replace('\n1.', '<br>1.')
        response = response.replace('\n2.', '<br>2.')
        response = response.replace('\n3.', '<br>3.')
        response = response.replace('\n4.', '<br>4.')
        response = response.replace('\n5.', '<br>5.')
        
        
        response = response.replace('\n\n', '<br><br>')
        
        
        response = response.replace('\n', '<br>')
        
        
        response = response.replace('<br><br><br>', '<br><br>')
        
        return response 