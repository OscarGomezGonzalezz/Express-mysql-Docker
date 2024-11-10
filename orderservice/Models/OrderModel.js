const db = require('../dbConnection')

// Async function to add orders into the database
async function insertOrder(name, isin, quantity, price, state) {
    const query = `INSERT INTO Orders(name, isin, quantity, price, state) VALUES (?, ?, ?, ?, ?)`;
    const values = [name, isin, quantity, price, state];
    
    try {
      const [result] = await db.execute(query, values);
      const [orderRows] = await db.execute(`SELECT * FROM Orders WHERE order_id = ?`, [result.insertId]);
      return orderRows[0];
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
  }

// Async function to get all orders from the database
async function getAllOrders(state) {
    let query = `SELECT * FROM Orders`;
    const values = [];
    
    //We can filter by State
    if (state) {
        query += ` WHERE state = ?`;
        values.push(state);
    }

    try {
        const [results] = await db.execute(query, values);
        console.log(results);
        return results;

    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

/// Async function to get an order by ID
async function getOrderById(id) {
    const query = `SELECT * FROM Orders WHERE order_id = ?`;
    
    try {
        const [results] = await db.execute(query, [id]);
        const order = results[0] || null; // Return the first result if found, otherwise null
        console.log(`Fetched order by ID ${id}:`, order);
        return order;
    } catch (error) {
        console.error(`Error fetching order by ID ${id}:`, error);
        throw error; // Rethrow error to handle in route
    }
}
// Async function to update the quantity of an order
async function updateOrderQuantity(id, quantity) {
    const query = `UPDATE Orders SET quantity = ? WHERE order_id = ? AND state = 0`;
    
    try {
        const [result] = await db.execute(query, [quantity, id]);
        if (result.affectedRows === 0) return null; // No update if order not found or state not 0
        const updatedOrder = await getOrderById(id);
        console.log("Updated order quantity:", updatedOrder);
        return updatedOrder; // Return updated order
    } catch (error) {
        console.error("Error updating order quantity:", error);
        throw error; // Rethrow error to handle in route
    }
}

// Async function to update the state of an order
async function updateOrderState(id, state) {
    const query = `UPDATE Orders SET state = ? WHERE order_id = ?`;
    
    try {
        const [result] = await db.execute(query, [state, id]);
        if (result.affectedRows === 0) return null; // No update if order not found
        const updatedOrder = await getOrderById(id);
        console.log("Updated order state:", updatedOrder);
        return updatedOrder; // Return updated order
    } catch (error) {
        console.error("Error updating order state:", error);
        throw error; // Rethrow error to handle in route
    }
}

// Async function to delete an order
async function deleteOrder(id) {
    const query = `DELETE FROM Orders WHERE order_id = ? AND state = 0`;
    
    try {
        const [result] = await db.execute(query, [id]);
        if (result.affectedRows === 0) {
            console.log('Order not deleted: Not found');
            return null;
        }
        const currentState = result[0].state;
        
        // error message if the state is not 0
        if (currentState !== 0) {
            console.log('Cannot delete order: State is not 0');
            return { error: 'Cannot delete order: Order state is not 0' };
        }
        console.log("Deleted order ID:", id);
        return id; // Return deleted order ID for confirmation
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error; // Rethrow error to handle in route
    }
}


module.exports = {
    insertOrder,
    getAllOrders,
    getOrderById,
    updateOrderQuantity,
    updateOrderState,
    deleteOrder,
};