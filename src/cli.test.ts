import { describe, it, expect } from "vitest";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

describe("CLI", () => {
  it("should show help message", async () => {
    const { stdout } = await execAsync("node dist/cli.js --help");
    expect(stdout).toContain("tiny-slugify v");
    expect(stdout).toContain("Usage:");
    expect(stdout).toContain("Options:");
    expect(stdout).toContain("Examples:");
  });

  it("should show version", async () => {
    const { stdout } = await execAsync("node dist/cli.js --version");
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("should slugify basic text", async () => {
    const { stdout } = await execAsync('node dist/cli.js "Hello World"');
    expect(stdout.trim()).toBe("Hello-World");
  });

  it("should slugify with symbol replacement", async () => {
    const { stdout } = await execAsync('node dist/cli.js "Hello World & Test"');
    expect(stdout.trim()).toBe("Hello-World-and-Test");
  });

  it("should work with pretty mode", async () => {
    const { stdout } = await execAsync(
      'node dist/cli.js --mode=pretty "Hello World & Test"'
    );
    expect(stdout.trim()).toBe("Hello-World-and-Test");
  });

  it("should work with rfc3986 mode", async () => {
    const { stdout } = await execAsync(
      'node dist/cli.js --mode=rfc3986 "Hello World & Test"'
    );
    expect(stdout.trim()).toBe("hello-world-and-test");
  });

  it("should work with custom replacement", async () => {
    const { stdout } = await execAsync(
      'node dist/cli.js --replacement="_" "Hello World"'
    );
    expect(stdout.trim()).toBe("Hello_World");
  });

  it("should work with lowercase option", async () => {
    const { stdout } = await execAsync(
      'node dist/cli.js --lower "Hello World"'
    );
    expect(stdout.trim()).toBe("hello-world");
  });

  it("should work with strict option", async () => {
    const { stdout } = await execAsync(
      'node dist/cli.js --strict "Hello World!"'
    );
    expect(stdout.trim()).toBe("Hello-World");
  });

  it("should work with fallback option", async () => {
    const { stdout } = await execAsync('node dist/cli.js --fallback "🎉"');
    expect(stdout.trim()).not.toBe("");
    expect(stdout.trim()).toMatch(/^[a-zA-Z0-9-]+$/);
  });

  it("should work with remove option", async () => {
    const { stdout } = await execAsync(
      'node dist/cli.js --remove="@." "hello@world.com"'
    );
    expect(stdout.trim()).toBe("hello-at-world-com"); // @ is mapped to "at" by baseMap
  });

  it("should work with stdin input", async () => {
    const { stdout } = await execAsync('echo "Hello World" | node dist/cli.js');
    expect(stdout.trim()).toBe("Hello-World");
  });

  it("should work with stdin and options", async () => {
    const { stdout } = await execAsync(
      'echo "Hello World & Test" | node dist/cli.js --mode=rfc3986'
    );
    expect(stdout.trim()).toBe("hello-world-and-test");
  });

  it("should handle no-trim option", async () => {
    const { stdout } = await execAsync(
      "node dist/cli.js --no-trim '-Hello World-'"
    );
    expect(stdout.trim()).toBe("-Hello-World-");
  });

  it("should handle no-collapse option", async () => {
    const { stdout } = await execAsync(
      'node dist/cli.js --no-collapse "Hello---World"'
    );
    expect(stdout.trim()).toBe("Hello---World");
  });

  it("should handle combined options", async () => {
    const { stdout } = await execAsync(
      'node dist/cli.js --mode=rfc3986 --replacement="_" "Hello World"'
    );
    expect(stdout.trim()).toBe("hello_world");
  });

  it("should error on invalid mode", async () => {
    try {
      await execAsync('node dist/cli.js --mode=invalid "Hello World"');
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.stderr).toContain("Invalid mode");
    }
  });

  it("should error on unknown option", async () => {
    try {
      await execAsync('node dist/cli.js --unknown "Hello World"');
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.stderr).toContain("Unknown option");
    }
  });

  it("should error on no input", async () => {
    try {
      await execAsync("echo '' | node dist/cli.js");
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.stderr).toContain("No input provided");
    }
  });
});
