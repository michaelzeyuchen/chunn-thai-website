import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

export interface AIAssistantConfig {
  projectEndpoint: string;
  agentId: string;
  threadId?: string;
}

export class AzureAIAssistant {
  private projectClient: AIProjectClient;
  private agentId: string;
  private threadId: string | null = null;
  private isInitialized = false;

  constructor(config: AIAssistantConfig) {
    this.projectClient = new AIProjectClient(
      config.projectEndpoint,
      new DefaultAzureCredential()
    );
    this.agentId = config.agentId;
    this.threadId = config.threadId || null;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Verify agent exists
      const agent = await this.projectClient.agents.getAgent(this.agentId);
      console.log(`Connected to agent: ${agent.name}`);

      // Create or retrieve thread
      if (!this.threadId) {
        const thread = await this.projectClient.agents.threads.create();
        this.threadId = thread.id;
        console.log(`Created new thread: ${this.threadId}`);
      } else {
        const thread = await this.projectClient.agents.threads.get(this.threadId);
        console.log(`Retrieved existing thread: ${thread.id}`);
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize AI Assistant:", error);
      throw error;
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.threadId) {
      throw new Error("Thread ID not available");
    }

    try {
      // Create user message
      await this.projectClient.agents.messages.create(this.threadId, "user", message);
      console.log(`Sent message: ${message}`);

      // Create and run
      let run = await this.projectClient.agents.runs.create(this.threadId, this.agentId);
      console.log(`Created run: ${run.id}`);

      // Poll until completion
      while (run.status === "queued" || run.status === "in_progress") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        run = await this.projectClient.agents.runs.get(this.threadId, run.id);
      }

      if (run.status === "failed") {
        console.error(`Run failed:`, run.lastError);
        throw new Error("AI Assistant failed to respond");
      }

      // Get the latest assistant message
      const messages = await this.projectClient.agents.messages.list(this.threadId, { 
        order: "desc",
        limit: 10 
      });

      for await (const msg of messages) {
        if (msg.role === "assistant") {
          const textContent = msg.content.find((c) => c.type === "text" && "text" in c);
          if (textContent && "text" in textContent) {
            return textContent.text.value;
          }
        }
      }

      return "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  async clearHistory(): Promise<void> {
    try {
      // Create a new thread for fresh conversation
      const thread = await this.projectClient.agents.threads.create();
      this.threadId = thread.id;
      console.log(`Created fresh thread: ${this.threadId}`);
    } catch (error) {
      console.error("Error clearing history:", error);
      throw error;
    }
  }

  getThreadId(): string | null {
    return this.threadId;
  }
}