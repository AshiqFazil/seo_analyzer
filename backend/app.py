from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
import os
from database import db, User, SEOAnalysis
from seo_analyzer import SEOAnalyzer
from gemini_integration import GeminiSEOAssistant
import json

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///seo_analyzer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

seo_analyzer = SEOAnalyzer()
try:
    gemini_assistant = GeminiSEOAssistant()
except:
    gemini_assistant = None
    print("Gemini API not configured - AI suggestions will be limited")

with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/analyze', methods=['POST'])
def analyze_seo():
   
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
    except:
        return jsonify({'error': 'Invalid token'}), 401
    
    url = request.get_json()['url']
    
    try:
        
        print(f"🔍 Analyzing URL: {url}")
        analysis = seo_analyzer.analyze_page(url)
        print(f"✅ SEO analysis completed. Score: {analysis.get('seo_score', 'N/A')}")
        
        
        if gemini_assistant:
            print("🤖 Getting AI suggestions...")
            ai_suggestions = gemini_assistant.generate_seo_suggestions(analysis)
            
           
            print(f"🔍 AI suggestions type: {type(ai_suggestions)}")
            if isinstance(ai_suggestions, dict):
                print(f"✅ AI suggestions is dict with keys: {list(ai_suggestions.keys())}")
            else:
                print(f"❌ AI suggestions is not dict: {ai_suggestions}")
            
            analysis['ai_suggestions'] = ai_suggestions
        else:
            print("⚠️  Gemini assistant not available")
            
            analysis['ai_suggestions'] = {
                "priority_issues": [
                    {
                        "issue": "AI Analysis Unavailable",
                        "recommendation": "Gemini API not configured. Please check the manual analysis above.",
                        "impact": "Use the detailed scores to identify priority areas",
                        "difficulty": "easy"
                    }
                ],
                "quick_wins": [
                    "Review title tag length (should be 50-60 characters)",
                    "Optimize meta description (150-160 characters)",
                    "Add alt text to images",
                    "Check heading structure"
                ],
                "overall_assessment": "Manual SEO analysis completed. Configure Gemini API for AI-powered suggestions."
            }
        
        
        seo_analysis = SEOAnalysis(
            user_id=user_id,
            url=url,
            seo_score=analysis['seo_score'],
            analysis_data=json.dumps(analysis)
        )
        db.session.add(seo_analysis)
        db.session.commit()
        
        print("✅ Analysis saved to database")
        return jsonify(analysis)
    
    except Exception as e:
        print(f"❌ Error in analyze_seo: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

@app.route('/api/history', methods=['GET'])
def get_analysis_history():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        token = token.split(' ')[1]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
    except:
        return jsonify({'error': 'Invalid token'}), 401
    
    analyses = SEOAnalysis.query.filter_by(user_id=user_id).order_by(SEOAnalysis.created_at.desc()).limit(10).all()
    
    history = []
    for analysis in analyses:
        history.append({
            'id': analysis.id,
            'url': analysis.url,
            'seo_score': analysis.seo_score,
            'created_at': analysis.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    
    return jsonify(history)

if __name__ == '__main__':
    app.run(debug=True)