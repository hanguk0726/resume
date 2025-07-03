// app/hooks/useMeta.ts
import { useEffect } from "react";

interface MetaTag {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
}

export function useMeta(metaTags: MetaTag[]) {
  useEffect(() => {
    // 제목 설정
    const titleTag = metaTags.find((tag) => tag.title);
    if (titleTag?.title) {
      document.title = titleTag.title;
    }

    // 기존 meta 태그 제거
    const existingMeta = document.querySelectorAll(
      'meta[name="description"], meta[name="keywords"], meta[property^="og:"]'
    );
    existingMeta.forEach((tag) => tag.remove());

    // 새 meta 태그 추가
    metaTags.forEach(({ name, property, content }) => {
      if (!content) return;

      const meta = document.createElement("meta");
      if (name) meta.name = name;
      if (property) meta.setAttribute("property", property);
      meta.content = content;
      document.head.appendChild(meta);
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      const addedMeta = document.querySelectorAll(
        'meta[name="description"], meta[name="keywords"], meta[property^="og:"]'
      );
      addedMeta.forEach((tag) => tag.remove());
    };
  }, [metaTags]);
}
