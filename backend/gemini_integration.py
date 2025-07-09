import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

class GeminiSEOAssistant:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("❌ GEMINI_API_KEY not found in environment variables")
        self.endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

    def _format_prompt(self, analysis_data):
        prompt = (
            "You are an expert SEO consultant. Analyze the following website data and provide detailed, actionable SEO recommendations.\n\n"
            "IMPORTANT: Respond ONLY with valid JSON in exactly this format:\n"
            "{\n"
            '  "priority_issues": [\n'
            '    {\n'
            '      "issue": "Title tag is too long",\n'
            '      "recommendation": "Reduce title to under 60 characters",\n'
            '      "impact": "High",\n'
            '      "difficulty": "easy"\n'
            '    }\n'
            '  ],\n'
            '  "quick_wins": [\n'
            '    "Add missing alt text to images",\n'
            '    "Optimize meta description length"\n'
            '  ],\n'
            '  "overall_assessment": "Your website has good foundation but needs improvements in technical SEO and content optimization."\n'
            "}\n\n"
            "Rules:\n"
            "- priority_issues: Array of objects with issue, recommendation, impact, difficulty\n"
            "- difficulty must be: 'easy', 'medium', or 'hard'\n"
            "- impact should describe the SEO benefit\n"
            "- quick_wins: Array of simple strings (actionable items)\n"
            "- overall_assessment: Single paragraph summary\n"
            "- Provide 3-5 priority issues and 3-5 quick wins\n"
            "- Response must be valid JSON only, no other text\n\n"
            "Website Analysis Data:\n"
            f"{json.dumps(analysis_data, indent=2)}"
        )
        return prompt

    def generate_seo_suggestions(self, analysis_data):
        if not self.api_key:
            return {
                "error": "Gemini API key not configured",
                "priority_issues": [],
                "quick_wins": [],
                "overall_assessment": "AI analysis unavailable: API key not configured."
            }

        headers = {
            "Content-Type": "application/json"
        }

        prompt_text = self._format_prompt(analysis_data)
        
        
        print("🔍 Debug - Sending prompt to Gemini:")
        print(f"Prompt length: {len(prompt_text)} characters")

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt_text}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,  
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 2048,
            }
        }

        try:
            print("📡 Making request to Gemini API...")
            response = requests.post(
                f"{self.endpoint}?key={self.api_key}",
                headers=headers,
                json=payload,
                timeout=30
            )

            print(f"📊 Response status: {response.status_code}")
            
            if response.status_code != 200:
                print("❌ Gemini API Error:", response.text)
                return {
                    "error": f"Gemini API error (Status: {response.status_code})",
                    "priority_issues": [],
                    "quick_wins": [],
                    "overall_assessment": "AI analysis temporarily unavailable due to API error."
                }

            result = response.json()
            
            
            if "candidates" in result and len(result["candidates"]) > 0:
                candidate = result["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    ai_response = candidate["content"]["parts"][0]["text"]
                    print(f"✅ Successfully got AI response ({len(ai_response)} characters)")
                    
                    
                    try:
                       
                        cleaned_response = ai_response.strip()
                        if cleaned_response.startswith("```json"):
                            cleaned_response = cleaned_response[7:]
                        if cleaned_response.endswith("```"):
                            cleaned_response = cleaned_response[:-3]
                        cleaned_response = cleaned_response.strip()
                        
                        parsed_suggestions = json.loads(cleaned_response)
                        
                        
                        if not isinstance(parsed_suggestions.get("priority_issues"), list):
                            parsed_suggestions["priority_issues"] = []
                        if not isinstance(parsed_suggestions.get("quick_wins"), list):
                            parsed_suggestions["quick_wins"] = []
                        if not isinstance(parsed_suggestions.get("overall_assessment"), str):
                            parsed_suggestions["overall_assessment"] = "Analysis completed successfully."
                        
                        print("✅ Successfully parsed JSON response")
                        return parsed_suggestions
                        
                    except json.JSONDecodeError as e:
                        print(f"❌ Failed to parse JSON response: {e}")
                        print(f"Raw response: {ai_response[:500]}...")
                        
                       
                        return self._parse_text_fallback(ai_response)
                        
                else:
                    print("❌ Unexpected response structure - no content/parts found")
                    return self._get_fallback_response("Unexpected response format from Gemini")
            else:
                print("❌ No candidates in response")
                return self._get_fallback_response("No response candidates from Gemini")
                
        except requests.exceptions.Timeout:
            print("❌ Request timeout")
            return self._get_fallback_response("Request timeout")
        except requests.exceptions.RequestException as e:
            print(f"❌ Request error: {e}")
            return self._get_fallback_response(f"Request error: {str(e)}")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return self._get_fallback_response(f"Unexpected error: {str(e)}")

    def _parse_text_fallback(self, text_response):
        """Fallback method to extract basic info from text response"""
        print("🔄 Using text fallback parser...")
        
        
        return {
            "priority_issues": [
                {
                    "issue": "SEO Analysis Available",
                    "recommendation": "Review the detailed analysis above for specific recommendations",
                    "impact": "Please check individual section scores for priority areas",
                    "difficulty": "medium"
                }
            ],
            "quick_wins": [
                "Review title tag length and content",
                "Check meta description optimization",
                "Ensure all images have alt text",
                "Verify heading structure (H1, H2, H3)"
            ],
            "overall_assessment": text_response[:500] + "..." if len(text_response) > 500 else text_response
        }

    def _get_fallback_response(self, error_message):
        """Get a structured fallback response when API fails"""
        return {
            "error": error_message,
            "priority_issues": [
                {
                    "issue": "AI Analysis Unavailable",
                    "recommendation": "Please try again later or check the manual analysis above",
                    "impact": "Use the detailed scores above to identify priority areas",
                    "difficulty": "easy"
                }
            ],
            "quick_wins": [
                "Review title tag (should be 50-60 characters)",
                "Optimize meta description (150-160 characters)",
                "Add alt text to images without it",
                "Ensure proper heading hierarchy"
            ],
            "overall_assessment": f"AI analysis temporarily unavailable ({error_message}). Please use the detailed metrics above to identify improvement areas."
        }


def test_gemini_integration():
    """Test function to verify Gemini API is working"""
    assistant = GeminiSEOAssistant()
    
    
    test_data = {
        "title": {"text": "Test Website - Very Long Title That Might Be Too Long", "length": 52},
        "meta_description": {"text": "A test website", "length": 14},
        "headings": {"h1_count": 1, "proper_structure": True},
        "content": {"word_count": 500},
        "images": {"total_images": 5, "images_with_alt": 3},
        "links": {"internal_links": 5, "external_links": 3}
    }
    
    print("🧪 Testing Gemini integration...")
    result = assistant.generate_seo_suggestions(test_data)
    print("📝 Test result:")
    print(json.dumps(result, indent=2))
    return result

if __name__ == "__main__":
    test_gemini_integration()