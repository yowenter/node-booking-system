const Node = require('./Nodes')

Node.create([
  // Level 8
  {
    name: 'Node 1',
    cluster: 'dev',
    capacity: 18,
    assets: {
      pcLab: true
    }
  },
  {
    name: 'Node 2',
    cluster: 'dev',
    capacity: 18,
    assets: {
      projector: true
    }
  },
  {
    name: 'Node 3',
    cluster: 'dev',
    capacity: 18,
    assets: {
      projector: true,
      opWalls: true
    }
  },
  {
    name: 'Node 4',
    cluster: 'dev',
    capacity: 24
  },
  {
    name: 'Node 5',
    cluster: 'dev',
    capacity: 18,
    assets: {
      opWalls: true
    }
  },
  {
    name: 'Node 6',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Node 7',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Node 8',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Node 9',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Node 10',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Node 11',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Node 12',
    cluster: 'dev',
    capacity: 18,
    assets: {
      tv: true
    }
  },
  {
    name: 'Node 13',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Node 14',
    cluster: 'dev',
    capacity: 18,
    assets: {
      tv: true
    }
  },
  {
    name: 'Node 15',
    cluster: 'dev',
    capacity: 18,
    assets: {
      tv: true
    }
  },
  {
    name: 'Studio 11',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Studio 12',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Studio 13',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Studio 14',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Studio 15',
    cluster: 'dev',
    capacity: 18
  },
  {
    name: 'Lab 01',
    cluster: 'dev',
    capacity: 20,
    assets: {
      macLab: true
    }
  },
  // Level 13
  {
    name: 'Node 1',
    floor: '13',
    capacity: 20,
    assets: {
      opWalls: true
    }
  },
  {
    name: 'Node 2',
    floor: '13',
    capacity: 20,
    assets: {
      opWalls: true
    }
  },
  {
    name: 'Node 3',
    floor: '13',
    capacity: 20,
    assets: {
      opWalls: true
    }
  },
  {
    name: 'Node 4',
    floor: '13',
    capacity: 20,
    assets: {
      projector: true,
      opWalls: true
    }
  },
  {
    name: 'Node 5',
    floor: '13',
    capacity: 20,
    assets: {
      projector: true
    }
  },
  {
    name: 'Node 6',
    floor: '13',
    capacity: 20,
    assets: {
      projector: true
    }
  },
  {
    name: 'Node 7',
    floor: '13',
    capacity: 20,
    assets: {
      projector: true
    }
  },
  {
    name: 'Node 8/9',
    floor: '13',
    capacity: 40,
    assets: {
      projector: true
    }
  },
  {
    name: 'Node 10',
    floor: '13',
    capacity: 16
  },
  {
    name: 'Node 11',
    floor: '13',
    capacity: 20
  },
  {
    name: 'Node 12',
    floor: '13',
    capacity: 20
  },
  {
    name: 'Node 13',
    floor: '13',
    capacity: 20,
    assets: {
      macLab: true
    }
  },
  {
    name: 'Node 14',
    floor: '13',
    capacity: 20,
    assets: {
      pcLab: true
    }
  },
  {
    name: 'Node 15',
    floor: '13',
    capacity: 20,
    assets: {
      pcLab: true
    }
  },
  {
    name: 'Node 16',
    floor: '13',
    capacity: 20,
    assets: {
      pcLab: true
    }
  },
  {
    name: 'Node 17',
    floor: '13',
    capacity: 20
  },
  {
    name: 'Node 18',
    floor: '13',
    capacity: 20
  },
  {
    name: 'Green Screen Nodes',
    floor: '13',
    capacity: null,
    assets: {
      tv: true
    }
  }
])
  .then((nodes) => {
    console.log(`Created ${nodes.length} nodes.`)
  })
  .catch((error) => {
    console.error(error)
  })