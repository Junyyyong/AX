# 프로젝트 명세서: Google AI Studio Interaction Archive

본 문서는 Google AI Studio Build로 제작한 다양한 HTML/JS/CSS 인터랙션 코드들을 한곳에서 관리하고 실행해볼 수 있는 아카이브 사이트 제작을 위한 요구사항 정의서입니다.

## 1. 프로젝트 개요
- **프로젝트 명**: Interaction Code Showcase
- **목표**: 왼쪽 메뉴에서 프로젝트 제목을 선택하면, 오른쪽 화면에서 해당 코드가 즉시 실행되는 블랙 테마의 포트폴리오 사이트 구축
- **주요 기능**: 인터랙션 목록 탐색, 실시간 코드 렌더링(Iframe), 다크 모드(Pure Black) UI

## 2. 디자인 요구사항 (UI/UX)
- **전체 테마**: Deep Black (#000000) 배경
- **레이아웃**: 2컬럼 레이아웃
    - **왼쪽 사이드바 (Width: 280px)**: 
        - 고정(Fixed) 위치 또는 스크롤 가능 영역
        - 코드 제목 리스트 (Hover 시 하이라이트 효과)
        - 선택된 항목에 활성화 표시 (Accent Color: #00FF99 또는 White)
    - **오른쪽 메인 영역 (Flexible)**:
        - 선택된 코드가 실행되는 Full-screen Iframe
        - 테두리 없음, 여백 없음
- **폰트**: 깔끔한 산세리프 폰트 (Pretendard, Inter 등)

## 3. 기술 스택 및 구조
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **데이터 관리**: `data.js` 파일에 JSON 형태로 인터랙션 코드 저장
- **렌더링 방식**: Iframe의 `srcdoc` 속성을 활용한 동적 코드 주입

## 4. 데이터 구조 (data.js)
각 아이템은 제목과 전체 HTML 코드를 포함합니다.
```javascript
const interactionData = [
  {
    id: 1,
    title: "Gravity Particles",
    code: `<!DOCTYPE html><html>...</html>` // AI Studio에서 생성된 전체 코드
  },
  {
    id: 2,
    title: "Neural Network Visualizer",
    code: `<!DOCTYPE html><html>...</html>`
  }
];