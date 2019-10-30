module.exports = function (sequelize, DataTypes) {
    let Transaction = sequelize.define("Transaction", {
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        odometer: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        serviceDesc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Parts price stored in cents
        partsPrice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Labor price stored in cents
        laborPrice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Tax stored in cents
        tax: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        // Total price stored in cents
        totalPrice: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        // Grand total (after tax) price stored in cents
        grandTotal: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        invoice: {
            type: DataTypes.BLOB,
            allowNull: true
        }
    });

    Transaction.associate = function (models) {
        // reference to transaction: transactionId is the column in the DB and RelationTV is the table name
        Transaction.belongsTo(models.Vehicle, {onDelete: "Cascade"});
        Transaction.belongsTo(models.Customer, {onDelete: "Cascade"});
    };

    return Transaction;
};