// A2Agent interface (JS doc style)

/**
 * @interface A2Agent
 * @property {function(SubGoalEnvelope): void} init
 * @property {function(): Promise<SubGoalComplete>} execute
 * @property {function(): AgentMetrics} report
 */

class A2Agent {
  /**
   * @param {object} config - SubGoalEnvelope
   */
  init(config) { throw new Error('Not implemented'); }

  /**
   * @returns {Promise<object>} SubGoalComplete
   */
  async execute() { throw new Error('Not implemented'); }

  /**
   * @returns {object} AgentMetrics
   */
  report() { throw new Error('Not implemented'); }
}

module.exports = { A2Agent };
