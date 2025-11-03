/**
 * URL processor utility functions
 */
export class UrlProcessor {
  /**
   * 获取当前页面的完整 URL
   * @returns 当前页面的完整 URL 字符串
   */
  static getCurrentUrl(): string {
    if (typeof window !== 'undefined' && window.location) {
      return window.location.href;
    }
    throw new Error('window is not available. This method can only be used in browser environment.');
  }

  /**
   * 从 URL 中提取域名
   * @param url - 需要解析的 URL 字符串
   * @returns 提取出的域名（不包含协议和路径）
   */
  static getDomain(url: string): string {
    try {
      let urlToParse = url.trim();

      // 若无协议前缀，则补上 https://
      if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(urlToParse)) {
        urlToParse = `https://${urlToParse}`;
      }

      const { hostname } = new URL(urlToParse);
      return hostname;
    } catch (error) {
      throw new Error(`Invalid URL: "${url}" (${(error as Error).message})`);
    }
  }
}

// ============================================
// 测试代码 - 可以直接运行
// 运行方式: node dist/toolkit/urlprocessor.js 或 ts-node src/toolkit/urlprocessor.ts
// ============================================
function runTests() {
  // 测试 URL 数组
  const testUrls: string[] = [
    // 完整 URL 测试
    'https://www.example.com/path/to/page',
    'http://example.com',
    'https://example.com',

    // 带查询参数和路径
    'https://example.com/page?param1=value1&param2=value2',
    'https://example.com/page#section',

    // 带端口号
    'https://example.com:8080/path',
    'http://localhost:3000',

    // 子域名
    'https://subdomain.example.com',
    'https://api.v2.example.com/path/to/resource',

    // 无协议的 URL（应该自动添加 https://）
    'www.example.com/path',
    'example.com',

    // 特殊域名
    'http://192.168.1.1:8080',
    'https://example.com/path%20with%20spaces/file.txt',

    // 边界情况
    'https://example.co.uk',
    'https://test.example.org:443',
  ];

  console.log('='.repeat(60));
  console.log('URL Processor 测试');
  console.log('='.repeat(60));
  console.log();

  let passedTests = 0;
  let failedTests = 0;

  testUrls.forEach((url, index) => {
    try {
      const domain = UrlProcessor.getDomain(url);
      console.log(`✓ 测试 ${index + 1}: ${url.padEnd(50)} -> ${domain}`);
      passedTests++;
    } catch (error) {
      console.log(`✗ 测试 ${index + 1}: ${url.padEnd(50)} -> 错误: ${(error as Error).message}`);
      failedTests++;
    }
  });

  console.log();
  console.log('='.repeat(60));
  console.log(`总计: ${testUrls.length} 个测试`);
  console.log(`通过: ${passedTests} 个`);
  console.log(`失败: ${failedTests} 个`);
  console.log('='.repeat(60));

  // 测试 getCurrentUrl (如果在浏览器环境中)
  if (typeof window !== 'undefined' && window.location) {
    try {
      const currentUrl = UrlProcessor.getCurrentUrl();
      console.log();
      console.log('当前 URL:', currentUrl);
    } catch (error) {
      console.log();
      console.log('getCurrentUrl 测试:', (error as Error).message);
    }
  } else {
    console.log();
    console.log('getCurrentUrl: 需要在浏览器环境中运行');
  }
}

// 如果直接运行此文件，执行测试
// 可以通过删除下面的注释来运行，或者直接调用 runTests()
runTests();
