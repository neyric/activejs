(function(){
  
/**
 * Adapter for v8cgi configured with MySQL.
 * @alias ActiveRecord.Adapters.v8cgiMySQL
 * @property {ActiveRecord.Adapter}
 */ 
ActiveRecord.Adapters.v8cgiMySQL = function v8cgiMySQL(){
    ActiveSupport.extend(this,ActiveRecord.Adapters.InstanceMethods);
    ActiveSupport.extend(this,ActiveRecord.Adapters.MySQL);
    ActiveSupport.extend(this,{
        executeSQL: function executeSQL(sql)
        {
            ActiveRecord.connection.log("Adapters.v8cgiMySQL.executeSQL: " + sql + " [" + ActiveSupport.arrayFrom(arguments).slice(1).join(',') + "]");
				var query = sprintf.apply(global, ([sql.replace(/\?/g,"'%s'")]).concat(ActiveSupport.arrayFrom(arguments).slice(1)) );
				var r = ActiveRecord.Adapters.v8cgiMySQL.db.query( query );
				r.rows  = r.fetchObjects ? r.fetchObjects() : [];
            return r;
        },
        getLastInsertedRowId: function getLastInsertedRowId()
        {
				return ActiveRecord.Adapters.v8cgiMySQL.db.insertId();
        },
        iterableFromResultSet: function iterableFromResultSet(result)
        {
            result.iterate = ActiveRecord.Adapters.defaultResultSetIterator;
            return result;
        }
    });
};

ActiveRecord.Adapters.v8cgiMySQL.connect = function connect(options)
{
    if(!options)
    {
        options = {};
    }
    for(var key in options)
    {
        options[key.toUpperCase()] = options[key];
    }

	 var MySQL = require("mysql").MySQL; 
	 var conf = ActiveSupport.extend({
        HOST: 'localhost',
        PORT: 3306,
        USER: 'root',
        PASS: '',
        NAME: 'jaxer'
    },options);

	 ActiveRecord.Adapters.v8cgiMySQL.db = new MySQL();
 	 ActiveRecord.Adapters.v8cgiMySQL.connection = ActiveRecord.Adapters.v8cgiMySQL.db.connect(conf.HOST, conf.USER, conf.PASS, conf.NAME); 
	
    return new ActiveRecord.Adapters.v8cgiMySQL();
};

})();
