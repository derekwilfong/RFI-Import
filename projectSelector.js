const readlineSync = require('readline-sync');

class ProjectSelector {
  async selectProject(projects) {
    if (!projects || projects.length === 0) {
      console.error('No projects found.');
      return null;
    }

    console.log('\n=== Available Projects ===\n');
    projects.forEach((project, index) => {
      const projectName = project.name || project.title || 'Unnamed Project';
      console.log(`${index + 1}. ${projectName}`);
      console.log(`   ID: ${project.id}`);
      if (project.description) {
        console.log(`   Description: ${project.description}`);
      }
      console.log('');
    });

    const selectedIndex = readlineSync.keyInSelect(
      projects.map(p => p.name || p.title || 'Unnamed Project'),
      'Select a project (or press q to cancel): '
    );

    if (selectedIndex === -1) {
      console.log('\nProject selection cancelled.');
      return null;
    }

    const selectedProject = projects[selectedIndex];
    console.log(`\n✓ Selected project: ${selectedProject.name || selectedProject.title}\n`);
    return selectedProject;
  }
}

module.exports = new ProjectSelector();
