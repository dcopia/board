import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash, Edit, Pin, RefreshCw } from 'lucide-react';
import { Input, Button, Dialog, DialogContent, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './UI';

const colorMap = {
  red: "bg-red-100 border-red-500",
  orange: "bg-orange-100 border-orange-500",
  yellow: "bg-yellow-100 border-yellow-500",
  blue: "bg-blue-100 border-blue-500",
  green: "bg-green-100 border-green-500",
  gray: "bg-gray-100 border-gray-500"
};

const statusMap = {
  red: "Da contattare",
  orange: "In attesa",
  yellow: "Interessata",
  blue: "Preventivo inviato",
  green: "A bordo",
  gray: "Proposta rifiutata"
};

const statusOrder = ['green', 'blue', 'yellow', 'orange', 'red', 'gray'];

const sampleProjects = [
  {
    id: 1,
    name: "Project Alpha",
    companies: [
      { id: 101, name: "TechCorp", status: "green", value: 50000 },
      { id: 102, name: "InnoSystems", status: "blue", value: 30000 },
      { id: 103, name: "DataDynamics", status: "yellow", value: 20000 },
      { id: 104, name: "CloudSolutions", status: "red", value: 10000 }
    ]
  },
  {
    id: 2,
    name: "Project Beta",
    companies: [
      { id: 201, name: "GlobalTech", status: "green", value: 60000 },
      { id: 202, name: "FutureSoft", status: "orange", value: 40000 },
      { id: 203, name: "SmartSystems", status: "blue", value: 35000 },
      { id: 204, name: "IntelliData", status: "gray", value: 15000 }
    ]
  },
  {
    id: 3,
    name: "Project Gamma",
    companies: [
      { id: 301, name: "TechInnovate", status: "yellow", value: 45000 },
      { id: 302, name: "DataPioneer", status: "green", value: 55000 },
      { id: 303, name: "CloudMasters", status: "blue", value: 25000 },
      { id: 304, name: "AIExperts", status: "orange", value: 30000 }
    ]
  }
];

const calculateProjectValue = (project) => {
  return project.companies
    .filter(company => company.status === 'green')
    .reduce((sum, company) => sum + (parseFloat(company?.value) || 0), 0);
};

const ProjectManagementApp = () => {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : sampleProjects;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [isAddCompanyDialogOpen, setIsAddCompanyDialogOpen] = useState(false);
  const [isEditCompanyDialogOpen, setIsEditCompanyDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyStatus, setNewCompanyStatus] = useState('blue');
  const [newCompanyValue, setNewCompanyValue] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [pinnedProjects, setPinnedProjects] = useState(() => {
    const savedPinnedProjects = localStorage.getItem('pinnedProjects');
    return savedPinnedProjects ? JSON.parse(savedPinnedProjects) : [];
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('pinnedProjects', JSON.stringify(pinnedProjects));
  }, [projects, pinnedProjects]);

  useEffect(() => {
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.companies.some(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const sorted = filtered.sort((a, b) => {
      if (pinnedProjects.includes(a.id) && !pinnedProjects.includes(b.id)) return -1;
      if (!pinnedProjects.includes(a.id) && pinnedProjects.includes(b.id)) return 1;
      return calculateProjectValue(b) - calculateProjectValue(a);
    });
    setFilteredProjects(sorted);
  }, [searchTerm, projects, pinnedProjects]);

  const sortCompaniesByStatus = useCallback((companies) => {
    return companies.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const handleAddProject = () => {
    if (newProjectName) {
      setProjects(prev => [...prev, { id: Date.now(), name: newProjectName, companies: [] }]);
      setNewProjectName('');
      setIsAddProjectDialogOpen(false);
    }
  };

  const handleAddCompany = () => {
    if (selectedProject && newCompanyName) {
      setProjects(prev => prev.map(project => 
        project.id === selectedProject.id 
          ? { 
              ...project, 
              companies: sortCompaniesByStatus([...project.companies, { 
                id: Date.now(), 
                name: newCompanyName, 
                status: newCompanyStatus,
                value: parseFloat(newCompanyValue) || 0
              }])
            }
          : project
      ));
      setNewCompanyName('');
      setNewCompanyStatus('blue');
      setNewCompanyValue('');
      setIsAddCompanyDialogOpen(false);
    }
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const handleDeleteCompany = () => {
    if (selectedProject && selectedCompany) {
      setProjects(prev => prev.map(project => 
        project.id === selectedProject.id 
          ? { ...project, companies: project.companies.filter(company => company.id !== selectedCompany.id) }
          : project
      ));
      setIsEditCompanyDialogOpen(false);
    }
  };

  const handleEditCompany = () => {
    if (selectedProject && selectedCompany) {
      setProjects(prev => prev.map(project => 
        project.id === selectedProject.id 
          ? {
              ...project,
              companies: sortCompaniesByStatus(project.companies.map(company =>
                company.id === selectedCompany.id
                  ? { ...company, status: newCompanyStatus, value: parseFloat(newCompanyValue) || 0 }
                  : company
              ))
            }
          : project
      ));
      setIsEditCompanyDialogOpen(false);
    }
  };

  const handleProjectEdit = (projectId, newName) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId ? { ...project, name: newName } : project
    ));
    setEditingProjectId(null);
  };

  const handleTogglePin = (projectId) => {
    setPinnedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleResetToDefault = () => {
    setProjects(sampleProjects);
    setPinnedProjects([]);
    localStorage.setItem('projects', JSON.stringify(sampleProjects));
    localStorage.setItem('pinnedProjects', JSON.stringify([]));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestione Progetti e Aziende</h1>
      
      <div className="mb-6 flex gap-2">
        <Input 
          type="text" 
          placeholder="Cerca progetto o azienda" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button 
          onClick={() => setIsAddProjectDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuovo Progetto
        </Button>
      </div>

      <div className="space-y-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-100 flex items-center justify-between">
              {editingProjectId === project.id ? (
                <>
                  <Input
                    value={editingProjectName}
                    onChange={(e) => setEditingProjectName(e.target.value)}
                    className="mr-2"
                  />
                  <Button onClick={() => handleProjectEdit(project.id, editingProjectName)}>
                    Salva
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold mr-4">{project.name}</h2>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {formatCurrency(calculateProjectValue(project))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleTogglePin(project.id)}
                      className={`text-gray-500 hover:text-blue-500 mr-2 ${pinnedProjects.includes(project.id) ? 'text-blue-500' : ''}`}
                    >
                      <Pin className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setEditingProjectId(project.id);
                        setEditingProjectName(project.name);
                      }}
                      className="text-gray-500 hover:text-blue-500 mr-2"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="p-4 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-16">
                {sortCompaniesByStatus(project.companies).map((company) => (
                  <div 
                    key={company.id} 
                    className={`${colorMap[company.status]} border-l-4 px-3 py-2 rounded shadow flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md`}
                    onClick={() => {
                      setSelectedProject(project);
                      setSelectedCompany(company);
                      setNewCompanyStatus(company.status);
                      setNewCompanyValue(company.value?.toString() || '');
                      setIsEditCompanyDialogOpen(true);
                    }}
                  >
                    <div className="font-semibold text-lg mb-1 truncate">{company.name}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{statusMap[company.status]}</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(company.value || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => {
                  setSelectedProject(project);
                  setIsAddCompanyDialogOpen(true);
                }}
                className="absolute bottom-4 right-4 rounded-full w-12 h-12 flex items-center justify-center"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
        <DialogContent>
          <h2 className="text-2xl font-bold mb-4">Aggiungi Nuovo Progetto</h2>
          <Input 
            type="text" 
            placeholder="Nome del progetto" 
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleAddProject} className="w-full">Aggiungi</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCompanyDialogOpen} onOpenChange={setIsAddCompanyDialogOpen}>
        <DialogContent>
          <h2 className="text-2xl font-bold mb-4">Aggiungi Nuova Azienda</h2>
          <Input 
            type="text" 
            placeholder="Nome dell'azienda" 
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
            className="mb-4"
          />
          <Input 
            type="number" 
            placeholder="Valore generato" 
            value={newCompanyValue}
            onChange={(e) => setNewCompanyValue(e.target.value)}
            className="mb-4"
          />
          <Select value={newCompanyStatus} onValueChange={setNewCompanyStatus}>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Seleziona lo stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="red">Da contattare</SelectItem>
              <SelectItem value="orange">In attesa</SelectItem>
              <SelectItem value="yellow">Interessata</SelectItem>
              <SelectItem value="blue">Preventivo inviato</SelectItem>
              <SelectItem value="green">A bordo</SelectItem>
              <SelectItem value="gray">Proposta rifiutata</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddCompany} className="w-full">Aggiungi</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditCompanyDialogOpen} onOpenChange={setIsEditCompanyDialogOpen}>
        <DialogContent>
          <h2 className="text-2xl font-bold mb-4">Modifica Azienda</h2>
          <p className="mb-4">Azienda: {selectedCompany?.name}</p>
          <Input 
            type="number" 
            placeholder="Valore generato" 
            value={newCompanyValue}
            onChange={(e) => setNewCompanyValue(e.target.value)}
            className="mb-4"
          />
          <Select value={newCompanyStatus} onValueChange={setNewCompanyStatus}>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Seleziona lo stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="red">Da contattare</SelectItem>
              <SelectItem value="orange">In attesa</SelectItem>
              <SelectItem value="yellow">Interessata</SelectItem>
              <SelectItem value="blue">Preventivo inviato</SelectItem>
              <SelectItem value="green">A bordo</SelectItem>
              <SelectItem value="gray">Proposta rifiutata</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={handleEditCompany} className="flex-grow">Aggiorna</Button>
            <Button onClick={handleDeleteCompany} className="bg-red-500 hover:bg-red-600">
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset button */}
      <Button 
        onClick={handleResetToDefault}
        className="fixed bottom-4 right-4 bg-red-100 text-red-600 hover:bg-red-200"
      >
        <RefreshCw className="h-5 w-5 mr-2" />
        Reset to Default
      </Button>
    </div>
  );
};

export default ProjectManagementApp;
