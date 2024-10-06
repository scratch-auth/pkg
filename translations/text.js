import { _config } from "../_config";

/**
 * @typedef {"ja"} DefaultLocale
 * @typedef {DefaultLocale | "en"} Locale
 */

/** @type {Readonly<Record<Locale, string>>} */
export const languageMap = {
  ja: "日本語",
  en: "English",
};

/** @type {Readonly<Record<Locale, string>>} */
export const titleMap = {
  ja: "Scratchの認証システムを提供するサービス",
  en: "Services that provide Scratch authentication",
};

/** @type {Readonly<Record<Locale, string>>} */
export const headDescriptionMap = {
  ja: "Scratch Auth はScratch用のシンプルなOAuthサービスです。開発者にはわかりやすいAPIを、ユーザーにはスムーズなログイン体験を提供します。Scratch Auth を使うことで、あなたのサイトに OAuth 機能を簡単に実装することができます。",
  en: "Scratch Auth is a simple OAuth service for Scratch. It provides developers with an easy-to-understand API and users with a smooth login experience. By using Scratch Auth, you can easily implement OAuth functionality into your site.",
};

/** @type {Readonly<Record<Locale, string>>} */
export const feedbackLinkMap = {
  ja: "ご質問は？ご意見をお聞かせください。",
  en: "Question? Give us feedback →",
};

/** @type {Readonly<Record<Locale, string>>} */
export const editTextMap = {
  ja: "Github で編集する →",
  en: "Edit this page on GitHub →",
};

/** @type {Readonly<Record<Locale, { text: string; copyright?: string }>>} */
export const footerTextMap = {
  ja: {
    text: "提供",
    copyright: `著作権 © ${new Date().getFullYear()} ${_config.author.name}.
    Nextraで構築されています。`,
  },
  en: {
    text: "Powered by",
    copyright: `Copyright © ${new Date().getFullYear()} ${_config.author.name}.
  Built with Nextra.`,
  },
};

/** @type {Readonly<Record<Locale, string>>} */
export const tableOfContentsTitleMap = {
  ja: "このページについて",
  en: "On This Page",
};

/** @type {Readonly<Record<Locale, string>>} */
export const searchPlaceholderMap = {
  ja: "ドキュメントを検索...",
  en: "Search documentation...",
};

/** @type {Readonly<Record<Locale, string>>} */
export const gitTimestampMap = {
  ja: "最終更新日",
  en: "Last updated on",
};
