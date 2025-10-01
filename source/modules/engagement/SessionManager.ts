// Class - SessionManager
class SessionManager {
    private visitId: string | null = null;
    private visitStartAt: Date | null = null;
    private readonly sessionTimeoutInMilliseconds = 30 * 60 * 1000; // 30 minutes

    initializeSession(): void {
        if(this.visitId === null || this.visitStartAt === null) {
            this.createNewVisit();
        }
    }

    private createNewVisit(): void {
        // Generate a unique visit ID using browser crypto API
        this.visitId = crypto.randomUUID();
        this.visitStartAt = new Date();
    }

    private checkAndResetSession(): void {
        // If no session exists, create one
        if(this.visitStartAt === null) {
            this.createNewVisit();
            return;
        }

        // Check if 30 minutes have passed since session start
        const timeSinceSessionStart = Date.now() - this.visitStartAt.getTime();
        if(timeSinceSessionStart > this.sessionTimeoutInMilliseconds) {
            this.createNewVisit();
        }
    }

    getVisitId(): string {
        this.checkAndResetSession();
        return this.visitId!;
    }

    getVisitStartAt(): string {
        this.checkAndResetSession();
        return this.visitStartAt!.toISOString();
    }

    resetSession(): void {
        this.createNewVisit();
    }
}

// Export singleton instance
export const sessionManager = new SessionManager();
