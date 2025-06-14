// SubGoalEnvelope schema and validation

const SubGoalEnvelopeSchema = {
  type: 'object',
  required: [
    'subGoalId', 'description', 'intentTags', 'canRecurse', 'recursionMeta', 'roleAssignment', 'traceMeta'
  ],
  properties: {
    subGoalId: { type: 'string' },
    description: { type: 'string' },
    intentTags: { type: 'array', items: { type: 'string' } },
    canRecurse: { type: 'boolean' },
    recursionMeta: {
      type: 'object',
      required: ['parentGoalId', 'depth', 'maxDepth', 'costBudgetRemaining'],
      properties: {
        parentGoalId: { type: 'string' },
        depth: { type: 'integer' },
        maxDepth: { type: 'integer' },
        costBudgetRemaining: { type: 'number' }
      }
    },
    roleAssignment: {
      type: 'object',
      required: ['roleId', 'capability'],
      properties: {
        roleId: { type: 'string' },
        capability: { type: 'string' },
        confidence: { type: 'number' }
      }
    },
    learningPath: { type: 'array', items: { type: 'string' } },
    traceMeta: {
      type: 'object',
      required: ['lineage', 'traceId', 'timestamp'],
      properties: {
        lineage: { type: 'array', items: { type: 'string' } },
        traceId: { type: 'string' },
        timestamp: { type: 'string' }
      }
    }
  }
};

function validateSubGoalEnvelope(payload) {
  // Minimal validation (expand as needed)
  for (const key of SubGoalEnvelopeSchema.required) {
    if (!(key in payload)) return false;
  }
  return true;
}

module.exports = { SubGoalEnvelopeSchema, validateSubGoalEnvelope };
