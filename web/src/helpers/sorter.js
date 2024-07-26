import React from 'react'

export const nodeSorter = (nodeList, cluster) => {
  
  let filteredList = nodeList.slice(0)
  
  // filter list of nodes to those on the given floor
  // let filteredList = copiedList.filter(node => {
  //   return node.cluster === cluster
  // })
  
  // function to sort nodes numerically by their floor number
  const numericalSort = nodeList => { 
    return nodeList.sort((first, second) => {
      const firstNode = first.name.replace(/\D+/, '')
      const secondNode = second.name.replace(/\D+/, '')
      if (parseInt(firstNode) > parseInt(secondNode)) {
        return 1
      } else {
        return 0
      }
    })
  }
  
  // numerically sort a new array with each node named 'Nodes'
  let nameNode = numericalSort(
    filteredList.filter(node => node.name[0] === 'R')
  )
  
  // numerically sort a new array with each node named 'Studio'
  let nameStudio = numericalSort(
    filteredList.filter(node => node.name[0] === 'S')
  )
  
  // numerically sort a new array with all other named node types
  let nameOther = numericalSort(
    filteredList.filter(node => node.name[0] !== 'S' && node.name[0] !== 'R')
  )
  
  // re-combine the sorted nodes, studios and others into a single array
  return nameNode.concat(nameStudio).concat(nameOther)
}
