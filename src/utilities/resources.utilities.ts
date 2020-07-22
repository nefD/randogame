import { ResourceNode } from 'redux/mapAreas/mapAreas.slice';
import { NODE_KEYS } from 'data/resources.consts';
import { uuid } from 'utilities/random.utilities';

export const ResourceNodeFactory = (config?: Partial<ResourceNode>): ResourceNode => ({
  id: uuid(),
  name: 'Known Resource Nodes',
  key: 'Tree',
  type: NODE_KEYS.Tree,
  remainingResources: 1,
  ...config,
});
