// Mock Dubsado integration for testing
const MOCK_PROJECTS = new Map();

class DubsadoMock {
  static async createProject(data) {
    const projectId = `PROJ-${Date.now()}`;
    const project = {
      id: projectId,
      status: 'new',
      createdAt: new Date().toISOString(),
      clientInfo: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city
      },
      eventDetails: {
        name: data.eventName,
        date: data.eventDate,
        time: data.eventTime,
        type: data.eventType,
        guestCount: data.guestCount,
        budget: data.budgetPerPerson
      },
      preferences: {
        cuisine: data.cuisinePreferences,
        dietary: {
          needs: data.dietaryNeeds,
          notes: data.dietaryNotes
        },
        vibe: data.eventVibe,
        vibeNotes: data.vibeDescription
      },
      notes: data.specialRequests
    };

    MOCK_PROJECTS.set(projectId, project);
    return {
      success: true,
      projectId,
      message: 'Project created successfully in Dubsado'
    };
  }

  static async getProject(projectId) {
    const project = MOCK_PROJECTS.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  static async updateProjectStatus(projectId, status) {
    const project = MOCK_PROJECTS.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    project.status = status;
    MOCK_PROJECTS.set(projectId, project);
    return {
      success: true,
      message: `Project status updated to ${status}`
    };
  }
}

module.exports = DubsadoMock; 