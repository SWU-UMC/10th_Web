const app = document.getElementById("app");

// 라우트별 화면 정의
const routes = {
  "/": () => "<h1>홈</h1><p>여기는 홈입니다.</p>",
  "/about": () => "<h1>소개</h1><p>소개 페이지입니다.</p>",
  "/contact": () => "<h1>문의</h1><p>문의 페이지입니다.</p>",
};

// 렌더링 함수
function render(path) {
  const view = routes[path] || (() => "<h1>404 Not Found</h1>");   // A||B =>A가 있으면 A를 쓰고 없으면 B를 쓰라는 의미
  app.innerHTML = view();
}

// 링크 클릭 처리 (페이지 새로고침 방지)
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const path = e.target.getAttribute("href");   //클릭한 경로 가져오기

    history.pushState(null, null, path);
    render(path); //렌더 실행
  }
});

