import requests
from bs4 import BeautifulSoup
import spacy
import nltk
from textstat import flesch_reading_ease, flesch_kincaid_grade
import re
from urllib.parse import urljoin, urlparse

class SEOAnalyzer:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Please install spaCy English model: python -m spacy download en_core_web_sm")
        
        
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
    
    def scrape_page(self, url):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            raise Exception(f"Error scraping page: {str(e)}")
    
    def analyze_page(self, url):
        soup = self.scrape_page(url)
        
        analysis = {
            'url': url,
            'title': self._analyze_title(soup),
            'meta_description': self._analyze_meta_description(soup),
            'headings': self._analyze_headings(soup),
            'content': self._analyze_content(soup),
            'images': self._analyze_images(soup),
            'links': self._analyze_links(soup, url),
            'technical': self._analyze_technical(soup),
            'readability': self._analyze_readability(soup)
        }
        
       
        analysis['seo_score'] = self._calculate_seo_score(analysis)
        
        return analysis
    
    def _analyze_title(self, soup):
        title_tag = soup.find('title')
        title = title_tag.text.strip() if title_tag else ""
        
        return {
            'text': title,
            'length': len(title),
            'optimal_length': 30 <= len(title) <= 60,
            'score': 100 if 30 <= len(title) <= 60 else max(0, 100 - abs(len(title) - 50) * 2)
        }
    
    def _analyze_meta_description(self, soup):
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        description = meta_desc.get('content', '').strip() if meta_desc else ""
        
        return {
            'text': description,
            'length': len(description),
            'optimal_length': 120 <= len(description) <= 160,
            'score': 100 if 120 <= len(description) <= 160 else max(0, 100 - abs(len(description) - 140) * 2)
        }
    
    def _analyze_headings(self, soup):
        headings = {}
        heading_tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        
        for tag in heading_tags:
            elements = soup.find_all(tag)
            headings[tag] = [elem.text.strip() for elem in elements]
        
        h1_count = len(headings.get('h1', []))
        has_proper_structure = h1_count == 1 and len(headings.get('h2', [])) > 0
        
        return {
            'structure': headings,
            'h1_count': h1_count,
            'proper_structure': has_proper_structure,
            'score': 100 if has_proper_structure else 50
        }
    
    def _analyze_content(self, soup):
        
        for script in soup(["script", "style"]):
            script.decompose()
        
        text = soup.get_text()
        word_count = len(text.split())
        
        return {
            'word_count': word_count,
            'adequate_length': word_count >= 300,
            'score': min(100, word_count / 3) if word_count < 300 else 100
        }
    
    def _analyze_images(self, soup):
        images = soup.find_all('img')
        total_images = len(images)
        images_with_alt = sum(1 for img in images if img.get('alt', '').strip())
        
        alt_ratio = images_with_alt / total_images if total_images > 0 else 1
        
        return {
            'total_images': total_images,
            'images_with_alt': images_with_alt,
            'alt_ratio': alt_ratio,
            'score': alt_ratio * 100
        }
    
    def _analyze_links(self, soup, base_url):
        links = soup.find_all('a', href=True)
        internal_links = 0
        external_links = 0
        
        base_domain = urlparse(base_url).netloc
        
        for link in links:
            href = link['href']
            if href.startswith('http'):
                if urlparse(href).netloc == base_domain:
                    internal_links += 1
                else:
                    external_links += 1
            elif href.startswith('/'):
                internal_links += 1
        
        return {
            'total_links': len(links),
            'internal_links': internal_links,
            'external_links': external_links,
            'score': min(100, (internal_links + external_links) * 10)
        }
    
    def _analyze_technical(self, soup):
        has_meta_viewport = bool(soup.find('meta', attrs={'name': 'viewport'}))
        has_meta_charset = bool(soup.find('meta', attrs={'charset': True}))
        
        return {
            'meta_viewport': has_meta_viewport,
            'meta_charset': has_meta_charset,
            'score': (has_meta_viewport + has_meta_charset) * 50
        }
    
    def _analyze_readability(self, soup):
        text = soup.get_text()
        
        try:
            flesch_score = flesch_reading_ease(text)
            fk_grade = flesch_kincaid_grade(text)
        except:
            flesch_score = 0
            fk_grade = 12
        
        return {
            'flesch_reading_ease': flesch_score,
            'flesch_kincaid_grade': fk_grade,
            'score': max(0, min(100, flesch_score))
        }
    
    def _calculate_seo_score(self, analysis):
        weights = {
            'title': 0.2,
            'meta_description': 0.15,
            'headings': 0.15,
            'content': 0.15,
            'images': 0.1,
            'links': 0.1,
            'technical': 0.1,
            'readability': 0.05
        }
        
        total_score = 0
        for category, weight in weights.items():
            if category in analysis:
                total_score += analysis[category]['score'] * weight
        
        return round(total_score, 1)