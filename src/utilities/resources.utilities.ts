import { ResourceNode } from 'redux/mapAreas/mapAreas.slice';

export const ResourceNodeFactory = (config?: Partial<ResourceNode>): ResourceNode => ({
  name: 'Known Resource Nodes',
  key: 'Tree',
  remainingResources: 1,
  ...config,
});
