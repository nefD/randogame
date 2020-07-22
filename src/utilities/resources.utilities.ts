import { ResourceNode } from 'redux/mapAreas/mapAreas.slice';
import { AREA_RESOURCE_TYPE } from 'data/resources.consts';
import { uuid } from 'utilities/random.utilities';

export const ResourceNodeFactory = (config?: Partial<ResourceNode>): ResourceNode => ({
  id: uuid(),
  name: 'Known Resource Nodes',
  key: 'Tree',
  type: AREA_RESOURCE_TYPE.Tree,
  remainingResources: 1,
  ...config,
});
