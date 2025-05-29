// Class - SessionManager
class SessionManager {
    private sessionStartTime: number | null = null;

    initializeSession(): void {
        if(this.sessionStartTime === null) {
            this.sessionStartTime = Date.now();
        }
    }

    getSessionDurationInMilliseconds(): number {
        if(this.sessionStartTime === null) {
            return 0;
        }

        const duration = Date.now() - this.sessionStartTime;

        // Reset after 30 minutes (same logic as EngagementProvider)
        if(duration > 30 * 60 * 1000) {
            this.sessionStartTime = Date.now();
            return 0;
        }

        return duration;
    }

    resetSession(): void {
        this.sessionStartTime = Date.now();
    }
}

// Export singleton instance
export const sessionManager = new SessionManager();
